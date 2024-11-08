import {
  AnchorComp,
  AreaComp,
  GameObj,
  HealthComp,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
} from "kaplay";
import { k } from "../../kaplay";
import { addDummyEnemy } from "./dummyEnemy";
import { getCurrentAudioStage, playAudioStage } from "../../audio";
import { triggerEvent } from "../../events";

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

export function addEnemy(enemyKey: keyof typeof enemyData, pos: Vec2) {
  const enemyConfig = enemyData[enemyKey];
  const enemy = k.add([
    k.sprite(enemyConfig.sprite),
    k.scale(3),
    k.pos(pos),
    k.area(),
    k.health(enemyConfig.health),
    k.anchor("center"),
    k.state("idle", ["fighting"]),
    "enemy",
  ]);

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
