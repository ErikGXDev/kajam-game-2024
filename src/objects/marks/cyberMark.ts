import { Vec2 } from "kaplay";
import { playMusic } from "../../audio";
import { k } from "../../kaplay";
import { worldMousePos } from "../../util";
import { MarkObj } from "./mark";

export function addCyberMark(mark: MarkObj) {
  playMusic({
    stages: {
      stealth_1: "cyber_mark_stealth_1",
      fight_1: "cyber_mark_fight_1",
      fight_end: "cyber_mark_fight_end",
    },
    defaultStage: "stealth_1",
    bpm: 127,
  });

  let canPrimaryAttack = true;
  let canSecondaryAttack = true;

  let overheat = 0;

  mark.onUpdate(() => {
    if (!k.isMouseDown("left")) {
      overheat = k.clamp(0, overheat - 0.33 * k.dt(), 1);
    }

    mark.get("hand1")[0].color = k.rgb(
      255,
      255 - overheat * 255,
      255 - overheat * 255
    );
  });

  mark.onMouseDown(async (m) => {
    // attack

    const mousePos = worldMousePos();

    const angle = mousePos.angle(mark.pos);

    if (m == "left" && canPrimaryAttack) {
      // Primary attack

      canPrimaryAttack = false;

      spawnBullet(mark.pos, angle);

      overheat += 0.02;

      k.wait(0.3 + overheat / 10).then(() => {
        canPrimaryAttack = true;
      });
    } else if (m == "right" && canSecondaryAttack) {
      // Secondary attack

      canSecondaryAttack = false;

      spawnBigBullet(mark.pos, angle);

      k.wait(4).then(() => {
        canSecondaryAttack = true;
      });
    }
  });
}

function spawnBullet(pos: Vec2, angle: number) {
  const vec = k.Vec2.fromAngle(angle);

  const bullet = k.add([
    k.sprite("cyber_bullet"),
    k.area(),
    k.pos(pos.add(vec.scale(56))),
    k.scale(2),
    k.anchor("center"),
    k.rotate(angle),
    "projectile",
    { damage: 1 },
  ]);

  bullet.onUpdate(() => {
    bullet.move(vec.scale(300));
  });

  bullet.onCollide("solid", () => {
    bullet.destroy();
  });
}

function spawnBigBullet(pos: Vec2, angle: number) {
  let vec = k.Vec2.fromAngle(angle);

  const bullet = k.add([
    k.sprite("cyber_big_bullet"),
    k.area({ scale: 0.5 }),
    k.pos(pos.add(vec.scale(56))),
    k.scale(2),
    k.anchor("center"),
    k.rotate(angle),
    "projectile",
    { damage: 2, keep: true },
  ]);

  bullet.onUpdate(() => {
    bullet.move(vec.scale(200));
  });

  bullet.onCollide("solid", () => {
    bullet.destroy();
  });

  let bounceCount = 0;

  bullet.onCollide("enemy", () => {
    const enemies = k.get("enemy");

    // sort by distance to bullet
    enemies.sort((a, b) => {
      return a.pos.dist(bullet.pos) - b.pos.dist(bullet.pos);
    });

    const target = enemies[1];

    if (target && bounceCount < 3) {
      const angle = bullet.pos.angle(target.pos) + 180;

      bullet.angle = angle;

      vec = k.Vec2.fromAngle(angle);
    } else {
      bullet.destroy();
    }
  });
}
