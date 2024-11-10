import {
  AnchorComp,
  AreaComp,
  GameObj,
  PosComp,
  ScaleComp,
  SpriteComp,
  StateComp,
  Vec2,
} from "kaplay";
import { k } from "../../kaplay";
import { Rebirth } from "../../types";
import { addRockerMark } from "./rockerMark";
import { worldMousePos } from "../../util";

export function addMark(rebirth: Rebirth, pos: Vec2) {
  const mark = k.add([
    k.sprite(rebirth.sprite),
    k.scale(2),
    k.pos(pos),
    k.anchor("center"),
    k.area(),
    k.body(),
    {
      specialMeter: 0,
      hasSpecial: false,
    },
    "mark",
  ]);

  const hand1 = mark.add([
    k.sprite(rebirth.sprite + "_hand1"),
    k.anchor("center"),
    k.pos(0, 0),
    k.rotate(0),
  ]);

  if (rebirth.twoHanded) {
  }

  const moveSpeed = 100;

  mark.onKeyDown("a", () => {
    mark.move(-moveSpeed, 0);
  });

  mark.onKeyDown("d", () => {
    mark.move(moveSpeed, 0);
  });

  mark.onKeyDown("w", () => {
    mark.move(0, -moveSpeed);
  });

  mark.onKeyDown("s", () => {
    mark.move(0, moveSpeed);
  });

  mark.onUpdate(() => {
    const mousePos = worldMousePos();

    const angle = mousePos.angle(mark.pos);

    const vec = k.Vec2.fromAngle(angle);

    hand1.pos = vec.scale(12);

    hand1.angle = angle - 90;
  });

  if (rebirth.add) rebirth.add(mark);

  return mark;
}

export type MarkObj = GameObj<
  | SpriteComp
  | ScaleComp
  | PosComp
  | AnchorComp
  | {
      specialMeter: number;
      hasSpecial: boolean;
    }
>;
