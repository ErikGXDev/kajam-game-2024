import { k } from "./kaplay";

export function worldMousePos() {
  return k.toWorld(k.mousePos());
}
