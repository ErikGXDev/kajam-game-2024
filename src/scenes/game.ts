import { getCurrentAudioStage, playAudioStage } from "../audio";
import { onEvent } from "../events";
import { k } from "../kaplay";
import { getSpawnPoint, instantiateMap } from "../map";
import { addEnemy } from "../objects/enemies/enemy";
import { addMark } from "../objects/marks/mark";
import { getRebirths } from "./rebirth";

k.scene("game", () => {
  const rebirths = getRebirths(3);

  const mark = addMark(rebirths[0], k.vec2(128, 128));

  k.on("enemyHit", "enemy", () => {
    if (getCurrentAudioStage() != "fight_1") {
      playAudioStage("fight_1");
    }
  });

  k.on("enemyDeath", "enemy", async () => {
    const enemies = k.get("enemy");

    // find if any enemy has the state "fighting"
    const isFighting = enemies.some((enemy) => enemy.state === "fighting");

    if (!isFighting) {
      await playAudioStage("fight_end", { loop: false });
      playAudioStage("stealth_1");
    }
  });

  const fpsText = k.add([
    k.text("FPS: 0", {
      size: 24,
    }),
    k.pos(10, 10),
  ]);

  fpsText.onUpdate(() => {
    fpsText.text = `FPS: ${k.debug.fps()}`;
  });

  const [mapData, map] = instantiateMap("Room1", k.vec2(0));

  const spawnPoint = getSpawnPoint(mapData);

  mark.pos = spawnPoint.add(map.pos);

  console.log(spawnPoint);
});
