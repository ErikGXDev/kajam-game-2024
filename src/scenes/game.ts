import { getCurrentAudioStage, playAudioStage } from "../audio";
import { k } from "../kaplay";
import { getCurrentMap, getSpawnPoint, instantiateMap } from "../map";
import { addMark, getCurrentMark } from "../objects/marks/mark";
import { getRebirths } from "../objects/marks/rebirth";
import { Rebirth } from "../types";

k.scene(
  "game",
  (keptData: {
    rebirthIndex?: number;
    markRebirths?: Rebirth[];
    points?: number;
  }) => {
    const rebirths = keptData.markRebirths || getRebirths(3);

    let currRebirthIndex = keptData.rebirthIndex || 0;
    let currRebirth = rebirths[currRebirthIndex];

    const mark = addMark(currRebirth, k.vec2(128, 128));

    let score = keptData.points || 0;

    k.wait(0.5, async () => {
      const scoreText = k.add([
        k.text(String(score), {
          size: 24,
        }),
        k.pos(k.toWorld(k.vec2(k.width() / 2, 28))),
        k.anchor("center"),
        k.color(254, 175, 52),
        k.scale(0),
      ]);

      scoreText.onUpdate(() => {
        scoreText.text = String(score);
      });

      k.tween(
        scoreText.scale,
        k.vec2(1),
        0.7,
        (p) => (scoreText.scale = p),
        k.easings.easeOutCubic
      );

      const nameText2 = k.add([
        k.text(currRebirth.name, {
          size: 18,
        }),
        k.pos(k.toWorld(k.vec2(k.width() / 2, k.height() / 2)).add(2)),
        k.anchor("center"),
        k.scale(0),
        k.rotate(6),
        k.color(0, 0, 0),
      ]);
      const nameText = k.add([
        k.text(currRebirth.name, {
          size: 18,
        }),
        k.pos(k.toWorld(k.vec2(k.width() / 2, k.height() / 2))),
        k.anchor("center"),
        k.rotate(6),
        k.scale(0),
      ]);

      k.tween(
        nameText.scale,
        k.vec2(1.3),
        0.7,
        (p) => (nameText.scale = p),
        k.easings.easeOutCubic
      );

      await k.tween(
        nameText2.scale,
        k.vec2(1.3),
        0.7,
        (p) => (nameText2.scale = p),
        k.easings.easeOutCubic
      );

      await k.wait(2);

      k.tween(
        nameText.scale,
        k.vec2(0),
        0.7,
        (p) => (nameText.scale = p),
        k.easings.easeOutCubic
      );

      await k.tween(
        nameText2.scale,
        k.vec2(0),
        0.7,
        (p) => (nameText2.scale = p),
        k.easings.easeOutCubic
      );

      nameText.destroy();
      nameText2.destroy();
    });

    function alertEnemies() {
      if (getCurrentAudioStage() != "fight_1" && isGameOver === false) {
        playAudioStage("fight_1");
      }

      k.get("enemy").forEach(async (enemy) => {
        if (enemy.state === "spawning") {
          await k.wait(2);
        }

        enemy.enterState("fighting");
      });
    }

    k.on("enemyAlert", "enemy", () => {
      alertEnemies();
    });

    k.on("markAlert", "mark", () => {
      alertEnemies();
    });

    k.on("enemyDeath", "enemy", async () => {
      score += 10;
      const enemies = k.get("enemy");

      // find if any enemy has the state "fighting"
      const isFighting = enemies.some((enemy) => enemy.state === "fighting");

      if (!isFighting) {
        // yes old code in prod
        //await playAudioStage("fight_end", { loop: false });
        //playAudioStage("stealth_1");
      }
    });

    let isGameOver = false;

    k.on("markDeath", "mark", async () => {
      if (isGameOver) return;

      isGameOver = true;

      k.get("enemy").forEach((enemy) => {
        enemy.unuse("patrol");
        enemy.unuse("pathfinder");
      });

      k.destroyAll("enemy");
      k.destroyAll("enemySpawnPoint");

      k.wait(1).then(() => k.destroyAll("enemySpawnPoint"));

      playAudioStage("fight_end", { loop: false });

      k.tween(mark.scale, k.vec2(0), 1, (p) => (mark.scale = p)).then(
        () => (mark.pos = k.vec2(-1000))
      );

      /*
        k.tween(audio.speed, 0.2, 3, (v) => {
          audio.speed = v;
        });*/

      const gameOverScreen = k.add([k.pos(0, -72), k.z(1000)]);

      gameOverScreen.add([
        k.pos(-k.width() / 2, -k.height() / 2),
        k.rect(k.width() * 3, k.height() * 2),
        k.color(0, 0, 0),
        k.opacity(0.5),
      ]);

      const center = k.toWorld(k.vec2(k.width() / 2, k.height() / 2));

      gameOverScreen.add([
        k.text("Eliminated", {
          size: 24,
        }),
        k.color(0, 0, 0),
        k.pos(center.add(2)),
        k.anchor("center"),
      ]);

      gameOverScreen.add([
        k.text("Eliminated", {
          size: 24,
        }),
        k.pos(center),
        k.anchor("center"),
      ]);

      await k.wait(2);

      if (currRebirthIndex === rebirths.length - 1) {
        gameOverScreen.add([
          k.text("Game Over!", {
            size: 16,
          }),
          k.anchor("center"),
          k.color(0, 0, 0),
          k.pos(center.add(0, 32).add(2)),
        ]);

        gameOverScreen.add([
          k.text("Game Over!", {
            size: 16,
          }),
          k.anchor("center"),
          k.pos(center.add(0, 32)),
        ]);

        const hScore = k.getData<number>("highScore") || 0;

        if (score > hScore) {
          k.setData("highScore", score);
        }

        await k.wait(1);

        gameOverScreen.add([
          k.text("Press any key to return to main menu", {
            size: 12,
          }),
          k.color(0, 0, 0),
          k.pos(center.add(0, 116).add(2)),
          k.anchor("center"),
        ]);

        gameOverScreen.add([
          k.text("Press any key to return to main menu", {
            size: 12,
          }),
          k.pos(center.add(0, 116)),
          k.anchor("center"),
        ]);

        k.onKeyPress(() => {
          k.go("mainMenu");
        });

        return;
      } else {
        gameOverScreen.add([
          k.text("Your next life is...", {
            size: 16,
          }),
          k.anchor("center"),
          k.color(0, 0, 0),
          k.pos(center.add(0, 32).add(2)),
        ]);

        gameOverScreen.add([
          k.text("Your next life is...", {
            size: 16,
          }),
          k.anchor("center"),
          k.pos(center.add(0, 32)),
        ]);

        await k.wait(1);

        const nextRebirth = rebirths[currRebirthIndex + 1];

        gameOverScreen.add([
          k.sprite(nextRebirth.sprite),
          k.scale(2),
          k.anchor("center"),
          k.color(0, 0, 0),
          k.pos(center.add(-78, 64).add(2)),
        ]);

        gameOverScreen.add([
          k.sprite(nextRebirth.sprite),
          k.scale(2),
          k.anchor("center"),
          k.pos(center.add(-78, 64)),
        ]);

        gameOverScreen.add([
          k.text(nextRebirth.name, {
            size: 16,
          }),
          k.anchor("left"),
          k.color(0, 0, 0),
          k.pos(center.add(-48, 64).add(2)),
        ]);

        gameOverScreen.add([
          k.text(nextRebirth.name, {
            size: 16,
          }),
          k.anchor("left"),
          k.pos(center.add(-48, 64)),
        ]);

        await k.wait(1.5);

        gameOverScreen.add([
          k.text("Press any key to rebirth", {
            size: 12,
          }),
          k.color(0, 0, 0),
          k.pos(center.add(0, 116).add(2)),
          k.anchor("center"),
        ]);

        gameOverScreen.add([
          k.text("Press any key to rebirth", {
            size: 12,
          }),
          k.pos(center.add(0, 116)),
          k.anchor("center"),
        ]);

        k.onKeyPress(() => {
          k.go("game", {
            rebirthIndex: currRebirthIndex + 1,
            markRebirths: rebirths,
            points: score,
          });
        });
      }
    });

    k.onKeyPress("ö", () => {
      mark.hurt(1);
    });

    const mapId = k.choose(["Room1", "Room2", "Room3"]);

    const { mapData, mapObj } = instantiateMap(
      mapId,
      currRebirth.sprite,
      k.vec2(0)
    );

    const spawnPoint = getSpawnPoint(mapData);

    mark.pos = spawnPoint.add(mapObj.pos);

    console.log(spawnPoint);

    drawRebirths(rebirths, currRebirthIndex);
    drawHearts();
  }
);

export function drawHearts() {
  const mark = getCurrentMark();

  const existingHearts = k.get("hearts");
  if (existingHearts.length > 0) {
    existingHearts.forEach((heart) => {
      k.destroy(heart);
    });
  }

  const hearts = k.add([k.pos(0, -32), "hearts"]);

  for (let i = 0; i < mark.hp(); i++) {
    hearts.add([k.sprite("heart"), k.pos(i * 32, 0), k.scale(1.8), "heart"]);
  }
}

const scale = 2;

export function drawRebirths(rebirths: Rebirth[], currIndex: number) {
  const existingRebirths = k.get("rebirths");
  if (existingRebirths.length > 0) {
    existingRebirths.forEach((rebirth) => {
      k.destroy(rebirth);
    });
  }

  const currentMap = getCurrentMap();

  if (!currentMap) return;

  const mapW = currentMap.mapData.width * scale;

  const gap = 1;

  const rebirthObj = k.add([k.pos(mapW - (32 + gap) * 3, -32), "rebirths"]);

  rebirths.forEach((rebirth, i) => {
    const sprite = i <= currIndex ? rebirth.sprite : "mystery_mark";

    rebirthObj.add([k.sprite(sprite), k.scale(1.8), k.pos(i * (32 + gap), 0)]);

    if (i < currIndex) {
      rebirthObj.use(k.color(100, 100, 100));
    }
  });
}
