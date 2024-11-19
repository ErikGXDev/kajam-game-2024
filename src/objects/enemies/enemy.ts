import {
  AnchorComp,
  AreaComp,
  GameObj,
  HealthComp,
  KEventController,
  NavMesh,
  PatrolComp,
  PosComp,
  ScaleComp,
  SpriteComp,
  StateComp,
  Vec2,
} from "kaplay";
import { k } from "../../kaplay";
import { addDummyEnemy } from "./dummyEnemy";
import { directionToVec, shakeObject } from "../../util";
import { getCurrentMap } from "../../map";
import { getCurrentMark } from "../marks/mark";

interface EnemyDataItem {
  sprite: string;
  health: number;
  speed?: number;
  add: (enemy: EnemyObj) => void;
}

type EnemyData = Record<string, EnemyDataItem>;

const enemyData: EnemyData = {
  dummy: {
    sprite: "dummy_enemy",
    health: 3,
    speed: 50,
    add: addDummyEnemy,
  },
};

export type EnemyKey = keyof typeof enemyData;

export function addEnemy(enemyKey: EnemyKey, pos: Vec2, navMesh: NavMesh) {
  const enemyConfig = enemyData[enemyKey];

  const enemy = k.add([
    k.sprite(enemyConfig.sprite),
    k.scale(2),
    k.pos(pos),
    k.area({ collisionIgnore: ["areaZone"] }),
    k.health(enemyConfig.health),
    k.anchor("center"),
    k.state("spawning", ["idle", "fighting", "spawning", "standing"]),
    k.tile(),
    k.color(255, 255, 255),
    k.pathfinder({
      graph: navMesh,
      navigationOpt: {
        type: "edges",
      },
    }),
    k.patrol({
      speed: enemyConfig.speed,
    }),
    "enemy",
  ]);

  enemy.onStateEnter("idle", () => {
    enemy.collisionIgnore = [];

    if (!enemy.exists()) return;

    const player = getCurrentMark();

    const path = enemy.navigateTo(player.pos);

    enemy.waypoints = path;
  });

  let i = 0;

  function updateNav() {
    if (!enemy.exists()) return;

    i++;
    // Theoretically 144hz players have it harder now
    if (i % 60 === 0) {
      const player = getCurrentMark();

      if (!player) return;

      const path = enemy.navigateTo(player.pos);

      if (!path) return;

      enemy.waypoints = path;
    }
  }

  enemy.onStateUpdate("idle", () => {
    updateNav();
  });

  enemy.onStateUpdate("fighting", () => {
    updateNav();
  });

  enemy.onCollide("projectile", (projectile) => {
    if (!projectile.keep) projectile.destroy();

    k.shake(1);

    enemy.hurt(projectile.damage);

    if (enemy.hp() <= 0) return;

    enemy.trigger("enemyAlert", enemy.pos.x, enemy.pos.y);

    if (enemy.state !== "fighting") enemy.enterState("fighting");
  });

  enemy.onDeath(async () => {
    enemy.destroy();

    enemy.trigger("enemyDeath", enemy.pos.x, enemy.pos.y);
  });

  let tweenE: KEventController;

  enemy.onHurt(() => {
    if (tweenE) tweenE.cancel();

    tweenE = k.tween(
      new k.Color(255, 100, 100),
      new k.Color(255, 255, 255),
      0.2,
      (p) => (enemy.color = p),
      k.easings.easeInOutCubic
    );
  });

  enemyConfig.add(enemy);

  return enemy;
}

export type EnemyObj = GameObj<
  | SpriteComp
  | PosComp
  | ScaleComp
  | AnchorComp
  | AreaComp
  | HealthComp
  | StateComp
  | PatrolComp
>;

export function addEnemySpawnPoint(pos: Vec2, direction: string) {
  const directionVec = directionToVec(direction);

  k.add([
    k.pos(pos),
    k.anchor("center"),
    "enemySpawnPoint",
    {
      direction,
      directionVec,
    },
  ]);
}

export function spawnEnemyWave(int = 8) {
  const spawnPoints = k.get("enemySpawnPoint");

  if (spawnPoints.length === 0) return;

  const randSpawnPoints = k.chooseMultiple(spawnPoints, 3);

  randSpawnPoints.forEach((spawnPoint) => {
    spawnEnemy("dummy", spawnPoint.pos, spawnPoint.directionVec);
  });

  k.wait(int).then(() => spawnEnemyWave(Math.max(2, int * 0.96)));
}

async function spawnEnemy(
  enemyName: string,
  spawnPos: Vec2,
  directionVec: Vec2
) {
  const currMap = getCurrentMap();

  if (!currMap) return;

  const enemy = addEnemy(
    enemyName as EnemyKey,
    spawnPos.add(directionVec.scale(-8)),
    currMap.navMesh
  );

  const shake = shakeObject(enemy);

  await k.wait(1.5);

  shake.stop();

  await k.tween(
    enemy.pos,
    enemy.pos.add(directionVec.scale(48)),
    1,
    (p) => (enemy.pos = p),
    k.easings.easeOutExpo
  );

  const enemies = k.get("enemy");

  // If any enemy is fighting
  const isFighting = enemies.some((e) => e.state === "fighting");

  enemy.enterState(isFighting ? "fighting" : "idle");
}
