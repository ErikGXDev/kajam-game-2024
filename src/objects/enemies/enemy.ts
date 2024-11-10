import {
  AnchorComp,
  AreaComp,
  GameObj,
  HealthComp,
  NavMesh,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
} from "kaplay";
import { k } from "../../kaplay";
import { addDummyEnemy } from "./dummyEnemy";
import { getCurrentAudioStage, playAudioStage } from "../../audio";
import { triggerEvent } from "../../events";
import { directionToVec, shakeObject } from "../../util";

interface EnemyDataItem {
  add: (enemy: EnemyObj) => void;
  health: number;
  speed?: number;
}

type EnemyData = Record<string, EnemyDataItem>;

const enemyData = {
  dummy: {
    sprite: "dummy_enemy",
    add: addDummyEnemy,
    health: 3,
    speed: 0,
  },
};

export function addEnemy(
  enemyKey: keyof typeof enemyData,
  pos: Vec2,
  navMesh?: NavMesh
) {
  const enemyConfig = enemyData[enemyKey];
  const enemy = k.add([
    k.sprite(enemyConfig.sprite),
    k.scale(2),
    k.pos(pos),
    k.area({ collisionIgnore: ["areaZone"] }),
    k.health(enemyConfig.health),
    k.anchor("center"),
    k.state("spawning", ["idle", "fighting", "spawning"]),

    "enemy",
  ]);

  enemy.onStateEnter("idle", () => {
    enemy.collisionIgnore = [];
  });

  enemy.onCollide("projectile", (projectile) => {
    projectile.destroy();

    k.shake(1);

    enemy.hurt(projectile.damage);

    if (enemy.hp() <= 0) return;

    enemy.trigger("enemyHit", enemy.pos.x, enemy.pos.y);

    if (enemy.state !== "fighting") enemy.enterState("fighting");
  });

  enemy.onDeath(async () => {
    enemy.destroy();

    enemy.trigger("enemyDeath", enemy.pos.x, enemy.pos.y);
  });

  enemyConfig.add(enemy);

  return enemy;
}

export type EnemyObj = GameObj<
  SpriteComp | PosComp | ScaleComp | AnchorComp | AreaComp | HealthComp
>;

export function addEnemySpawnPoint(pos: Vec2, direction: string) {
  const directionVec = directionToVec(direction);

  const spawnPoint = k.add([
    k.rect(16, 16),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
    "enemySpawnPoint",
    {
      directionVec,
    },
  ]);

  spawnEnemy(spawnPoint.pos, spawnPoint.directionVec);
}

async function spawnEnemy(spawnPos: Vec2, directionVec: Vec2) {
  const enemy = addEnemy("dummy", spawnPos.add(directionVec.scale(-8)));

  const shake = shakeObject(enemy);

  await k.wait(1.5);

  shake.stop();

  k.tween(
    enemy.pos,
    enemy.pos.add(directionVec.scale(48)),
    1,
    (p) => (enemy.pos = p),
    k.easings.easeOutExpo
  );
}
