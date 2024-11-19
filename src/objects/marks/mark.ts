import {
  AnchorComp,
  GameObj,
  HealthComp,
  KEventController,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
} from "kaplay";
import { k } from "../../kaplay";
import { Rebirth } from "../../types";
import { worldMousePos } from "../../util";
import { drawHearts } from "../../scenes/game";

export function addMark(rebirth: Rebirth, pos: Vec2) {
  const mark = k.add([
    k.sprite(rebirth.sprite),
    k.scale(2),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
    k.body(),
    k.health(5),
    k.color(255, 255, 255),
    {
      rebirth,
    },
    "mark",
  ]);

  mark.onCollide("enemyProjectile", (projectile) => {
    projectile.destroy();
    mark.hurt(projectile.damage);
  });

  mark.onCollide("enemy", (enemy) => {
    enemy.destroy();
    mark.hurt(1);
  });

  const hand1 = mark.add([
    k.sprite(rebirth.sprite + "_hand1"),
    k.anchor("center"),
    k.pos(0, 0),
    k.rotate(0),
    k.color(255, 255, 255),
    "hand1",
  ]);

  if (rebirth.twoHanded) {
    mark.add([
      k.sprite(rebirth.sprite + "_hand2"),
      k.anchor("center"),
      k.pos(11, 4),
      k.rotate(0),
      "hand2",
    ]);
  }

  const moveSpeed = 100;

  mark.onKeyDown("a", () => {
    if (mark.hp() <= 0) return;
    mark.move(-moveSpeed, 0);
  });

  mark.onKeyDown("d", () => {
    if (mark.hp() <= 0) return;
    mark.move(moveSpeed, 0);
  });

  mark.onKeyDown("w", () => {
    if (mark.hp() <= 0) return;
    mark.move(0, -moveSpeed);
  });

  mark.onKeyDown("s", () => {
    if (mark.hp() <= 0) return;
    mark.move(0, moveSpeed);
  });

  mark.onUpdate(() => {
    const mousePos = worldMousePos();

    const angle = mousePos.angle(mark.pos);

    const vec = k.Vec2.fromAngle(angle);

    hand1.pos = vec.scale(12);

    hand1.angle = angle - 90;

    if ((hand1.angle > 0 || hand1.angle < -180) && rebirth.twoHanded) {
      hand1.flipX = false;
    } else {
      hand1.flipX = true;
    }
  });

  let tweenE: KEventController;

  mark.onHurt(() => {
    if (tweenE) tweenE.cancel();

    tweenE = k.tween(
      new k.Color(255, 100, 100),
      new k.Color(255, 255, 255),
      0.2,
      (p) => (mark.color = p),
      k.easings.easeInOutCubic
    );

    k.shake(2);

    drawHearts();

    mark.trigger("markAlert");
  });

  mark.onDeath(() => {
    mark.trigger("markDeath", mark.pos.x, mark.pos.y);
  });

  if (rebirth.add) rebirth.add(mark);

  return mark;
}

export function getCurrentMark() {
  return k.get("mark")[0] as MarkObj;
}

export type MarkObj = GameObj<
  | SpriteComp
  | ScaleComp
  | PosComp
  | AnchorComp
  | { rebirth: Rebirth }
  | HealthComp
>;
