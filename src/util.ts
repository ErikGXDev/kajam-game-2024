import { GameObj } from "kaplay";
import { k } from "./kaplay";

export function worldMousePos() {
  return k.toWorld(k.mousePos());
}

export function directionToVec(direction: string) {
  let directionVec = k.vec2(0, 0);
  switch (direction) {
    case "up":
      directionVec = k.vec2(0, -1);
      break;
    case "down":
      directionVec = k.vec2(0, 1);
      break;
    case "right":
      directionVec = k.vec2(1, 0);
      break;
    case "left":
      directionVec = k.vec2(-1, 0);
      break;
  }

  return directionVec;
}

export function shakeObject(obj: GameObj) {
  const origin = obj.pos.clone();

  const lp = k.loop(0.05, () => {
    obj.pos = origin.add(k.randi(-4, 4), k.randi(-4, 4));
  });

  return {
    stop: () => {
      lp.cancel();
      obj.pos = origin;
    },
  };
}
