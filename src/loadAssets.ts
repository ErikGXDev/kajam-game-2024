import { k } from "./kaplay";
import { loadMap } from "./map";

export function loadAssets() {
  // Mark sprites
  k.loadSprite("normal_mark", "sprites/mark/normal_mark.png");
  k.loadSprite("rocker_mark", "sprites/mark/rocker_mark.png");
  k.loadSprite("rocker_mark_hand1", "sprites/mark/rocker_mark_hand.png");
  k.loadSprite("cyber_mark", "sprites/mark/cyber_mark.png");
  k.loadSprite("beach_mark", "sprites/mark/beach_mark.png");
  k.loadSprite("ninja_mark", "sprites/mark/ninja_mark.png");
  k.loadSprite("knight_mark", "sprites/mark/knight_mark.png");

  // Enemy sprites
  k.loadSprite("dummy_enemy", "sprites/enemy/dummy_enemy.png");

  k.loadSpriteAtlas("sprites/projectiles/notes.png", {
    rocker_note1: { x: 0, y: 0, width: 7, height: 16 },
    rocker_note2: { x: 7, y: 0, width: 11, height: 16 },
    rocker_note3: { x: 18, y: 0, width: 16, height: 16 },
    speaker_note: { x: 34, y: 0, width: 12, height: 16 },
  });

  k.loadSound("rocker_attack1", "sounds/effects/rocker_attack1.wav");
  k.loadSound("rocker_attack2", "sounds/effects/rocker_attack2.wav");
  k.loadSound("rocker_attack3", "sounds/effects/rocker_attack3.wav");
  k.loadSound("riff2", "sounds/effects/riff2.wav");

  k.loadSound("rocker_music", "sounds/music/sb_pariah_nomelody.mp3");
  k.loadSound("rocker_music_special", "sounds/music/sb_pariah.mp3");

  k.loadSound("rock_stealth_1", "sounds/music/rock/stealth_1.wav");
  k.loadSound("rock_stealth_2", "sounds/music/rock/stealth_2.wav");
  k.loadSound("rock_fight_1", "sounds/music/rock/fight_1.wav");
  k.loadSound("rock_fight_2", "sounds/music/rock/fight_2.wav");
  k.loadSound("rock_fight_end", "sounds/music/rock/fight_end.wav");

  ["Room1", "Room2"].forEach((map) => {
    loadMap(map);
  });
}
