import { addRockerMark } from "./rockerMark";
import { Rebirth } from "../../types";
import { addNormalMark } from "./normalMark";
import { addCyberMark } from "./cyberMark";

const lives: Rebirth[] = [
  {
    name: "Normal Mark",
    description: "Scarily average.",
    sprite: "normal_mark",
    twoHanded: true,
    add: addNormalMark,
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
    add: addCyberMark,
  },
];

/*

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
  */

export function getAllRebirths(): Rebirth[] {
  return lives;
}

export function getRebirths(amount: number): Rebirth[] {
  const rebirths = new Set<Rebirth>();
  while (rebirths.size < amount && rebirths.size < lives.length) {
    const randomIndex = Math.floor(Math.random() * lives.length);
    rebirths.add(lives[randomIndex]);
  }
  return Array.from(rebirths);
}
