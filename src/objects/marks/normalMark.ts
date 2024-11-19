import { Vec2 } from "kaplay";
import { playMusic } from "../../audio";
import { MarkObj } from "./mark";
import { k } from "../../kaplay";
import { worldMousePos } from "../../util";

export function addNormalMark(mark: MarkObj) {
  playMusic({
    stages: {
      stealth_1: "normal_mark_stealth_1",
      fight_1: "normal_mark_fight_1",
      fight_end: "normal_mark_fight_end",
    },
    defaultStage: "stealth_1",
    bpm: 127,
  });

  let canPrimaryAttack = true;
  let canSecondaryAttack = true;

  mark.onMouseDown(async (m) => {
    const mousePos = worldMousePos();

    const angle = mousePos.angle(mark.pos);

    if (m == "left" && canPrimaryAttack) {
      canPrimaryAttack = false;

      spawnBullet(mark.pos, angle);

      k.wait(0.3).then(() => {
        canPrimaryAttack = true;
      });
    }
    if (m == "right" && canSecondaryAttack) {
      canSecondaryAttack = false;

      spawnLaser(mark.pos, angle);

      k.wait(4).then(() => {
        canSecondaryAttack = true;
      });
    }
  });
}

function spawnBullet(pos: Vec2, angle: number) {
  const vec = k.Vec2.fromAngle(angle + k.randi(-8, 8));

  const bullet = k.add([
    k.sprite("normal_bullet"),
    k.area(),
    k.pos(pos.add(vec.scale(32))),
    k.scale(2),
    k.anchor("center"),
    k.rotate(angle),
    "projectile",
    { damage: 1 },
  ]);

  bullet.onCollide("solid", () => {
    bullet.destroy();
  });

  bullet.onUpdate(() => {
    bullet.move(vec.scale(400));
  });
}

async function spawnLaser(pos: Vec2, angle: number) {
  const vec = k.Vec2.fromAngle(angle);

  const laser = k.add([
    k.pos(pos.add(vec.scale(56))),
    k.scale(2),
    k.rotate(angle - 90),
    k.anchor("center"),
  ]);

  // repeat 10 times
  for (let i = 0; i < 30; i++) {
    const part = laser.add([
      k.pos(0, i * 16),
      k.sprite("normal_laser"),
      k.anchor("center"),
      k.rotate(90),
      k.area(),
      k.scale(1),
    ]);

    part.onCollide("enemy", (enemy) => {
      enemy.hurt(1.5);
    });

    k.tween(part.scale, k.vec2(1, 0), 0.5, (p) => (part.scale = p));
  }

  await k.wait(0.5);

  laser.destroy();
}
