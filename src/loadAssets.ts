import { k } from "./kaplay";
import { getAllRebirths } from "./objects/marks/rebirth";

export function loadAssets() {
  // Mark sprites
  k.loadSprite("normal_mark", "sprites/mark/normal_mark.png");
  k.loadSprite("normal_mark_hand1", "sprites/mark/normal_mark_hand1.png");
  k.loadSprite("normal_mark_hand2", "sprites/mark/normal_mark_hand2.png");
  k.loadSprite("rocker_mark", "sprites/mark/rocker_mark.png");
  k.loadSprite("rocker_mark_hand1", "sprites/mark/rocker_mark_hand.png");
  k.loadSprite("cyber_mark", "sprites/mark/cyber_mark.png");
  k.loadSprite("cyber_mark_hand1", "sprites/mark/cyber_mark_hand1.png");
  k.loadSprite("cyber_mark_hand2", "sprites/mark/cyber_mark_hand2.png");
  k.loadSprite("beach_mark", "sprites/mark/beach_mark.png");
  k.loadSprite("ninja_mark", "sprites/mark/ninja_mark.png");
  k.loadSprite("knight_mark", "sprites/mark/knight_mark.png");

  // Enemy sprites
  k.loadSprite("dummy_enemy", "sprites/enemy/dummy_enemy.png");
  k.loadSprite("dummy_enemy_bullet", "sprites/enemy/dummy_enemy_bullet.png");

  k.loadSpriteAtlas("sprites/projectiles/notes.png", {
    rocker_note1: { x: 0, y: 0, width: 7, height: 16 },
    rocker_note2: { x: 7, y: 0, width: 11, height: 16 },
    rocker_note3: { x: 18, y: 0, width: 16, height: 16 },
    speaker_note: { x: 34, y: 0, width: 12, height: 16 },
  });

  k.loadSpriteAtlas("sprites/projectiles/bullets.png", {
    normal_bullet: { x: 0, y: 0, width: 5, height: 3 },
    normal_laser: { x: 0, y: 3, width: 16, height: 4 },
  });

  k.loadSpriteAtlas("sprites/projectiles/cyber_mark_bullets.png", {
    cyber_bullet: { x: 0, y: 0, width: 7, height: 3 },
    cyber_big_bullet: { x: 0, y: 3, width: 9, height: 6 },
  });

  k.loadSound("rocker_attack1", "sounds/effects/rocker_attack1.wav");
  k.loadSound("rocker_attack2", "sounds/effects/rocker_attack2.wav");
  k.loadSound("rocker_attack3", "sounds/effects/rocker_attack3.wav");
  k.loadSound("riff2", "sounds/effects/riff2.wav");

  const rebirths = getAllRebirths();

  rebirths.forEach((rebirth) => {
    const mark = rebirth.sprite;
    k.loadSound(`${mark}_stealth_1`, `sounds/music/${mark}/stealth_1.wav`);
    k.loadSound(`${mark}_fight_1`, `sounds/music/${mark}/fight_1.wav`);
    k.loadSound(`${mark}_fight_end`, `sounds/music/${mark}/fight_end.wav`);

    const tilesheetOpt: Record<string, any> = {};

    tilesheetOpt[`${mark}_destroyable`] = {
      x: 0,
      y: 48,
      width: 16,
      height: 16,
    };

    tilesheetOpt[`${mark}_background`] = {
      x: 16,
      y: 48,
      width: 16,
      height: 16,
    };

    k.loadSpriteAtlas(`sprites/tileset/${mark}_tileset.png`, tilesheetOpt);
  });

  k.loadSprite("heart", "sprites/heart.png");
  k.loadSprite("mystery_mark", "sprites/mark/mystery_mark.png");

  ["Room1", "Room2", "Room3"].forEach((map) => {
    k.loadJSON(map + "_data", `maps/${map}/data.json`);
    k.loadJSON(map + "_nav", `maps/${map}/nav.json`);

    rebirths.forEach((rebirth) => {
      k.loadSprite(
        `${map}_map_${rebirth.sprite}`,
        `maps/${map}/map_${rebirth.sprite}.png`
      );
    });
  });

  k.loadBitmapFont("unscii", "sprites/fonts/unscii_8x8.png", 8, 8);

  k.loadMusic("mainMenu_1", "sounds/music/sb_neon_nomelody.mp3");
}
