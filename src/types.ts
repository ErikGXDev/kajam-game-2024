import { MarkObj } from "./objects/marks/mark";

export interface Rebirth {
  name: string;
  description: string;
  sprite: string;
  twoHanded: boolean;
  add?: (mark: MarkObj) => void;
}
