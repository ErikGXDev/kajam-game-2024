import { addRockerMark } from "../objects/marks/rockerMark";
import { Rebirth } from "../types";

const lives: Rebirth[] = [
  {
    name: "Normal Mark",
    description: "Scarily average.",
    sprite: "normal_mark",
    twoHanded: true,
  },
  {
    name: "Rocker Mark",
    description: "His enemies have tinnitus.",
    sprite: "rocker_mark",
    twoHanded: false,
    add: addRockerMark,
  },
  {
    name: "Cyber Mark",
    description: "Back from the future.",
    sprite: "cyber_mark",
    twoHanded: true,
  },
  {
    name: "Beach Mark",
    description: "He's got a tan.",
    sprite: "beach_mark",
    twoHanded: true,
  },
  {
    name: "Ninja Mark",
    description: "Noone saw him coming.",
    sprite: "ninja_mark",
    twoHanded: false,
  },
  {
    name: "Knight Mark",
    description: "Straight out of the middle ages.",
    sprite: "knight_mark",
    twoHanded: true,
  },
];

export function getRebirths(amount: number) {
  return [lives[1]];
  const rebirths = [];
  for (let i = 0; i < amount; i++) {
    const randomIndex = Math.floor(Math.random() * lives.length);
    rebirths.push(lives[randomIndex]);
  }
  return rebirths;
}
