import { Vec2 } from "kaplay";
import { k } from "../../kaplay";
import { EnemyObj } from "./enemy";
import { getCurrentMark } from "../marks/mark";
import { lineOfSight } from "../../util";

export function addDummyEnemy(enemy: EnemyObj) {
  console.log("Dummy");

  enemy.onStateUpdate("fighting", () => {
    const mark = getCurrentMark();

    if (
      enemy.pos.dist(mark.pos) < 128 &&
      canShoot &&
      lineOfSight(enemy, mark)
    ) {
      canShoot = false;
      enemy.enterState("standing");
    }
  });

  let canShoot = true;

  enemy.onStateEnter("standing", async () => {
    const mark = getCurrentMark();

    enemy.patrolSpeed = 0;

    console.log("Stand");

    await k.wait(0.5);

    if (!enemy.exists()) return;

    const angle = mark.pos.angle(enemy.pos);

    spawnDummyProjectile(enemy.pos, angle);

    enemy.patrolSpeed = 50;

    enemy.enterState("fighting");

    await k.wait(2);

    canShoot = true;
  });
}

function spawnDummyProjectile(pos: Vec2, angle: number) {
  const vec = k.Vec2.fromAngle(angle);

  const projectile = k.add([
    k.sprite("dummy_enemy_bullet"),
    k.scale(2),
    k.rotate(0),
    k.area(),
    k.pos(pos),
    "enemyProjectile",
    { damage: 1 },
  ]);

  k.tween(projectile.scale, k.vec2(2.5), 0.4, (p) => (projectile.scale = p));

  const speed = 100;

  projectile.onUpdate(() => {
    projectile.move(vec.scale(speed));
    projectile.angle += 90 * k.dt();
  });

  projectile.onCollide("solid", () => {
    projectile.destroy();
  });
}
