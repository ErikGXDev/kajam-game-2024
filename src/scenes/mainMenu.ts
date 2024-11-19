import { k } from "../kaplay";
import { getAllRebirths } from "../objects/marks/rebirth";

k.scene("mainMenu", () => {
  const mainMenuAudio = k.play("mainMenu_1", {
    volume: 0.5,
  });

  k.add([
    k.text("MARK: Rebirth", {
      size: 48,
    }),
    k.pos(k.width() / 2, k.height() / 4),

    k.anchor("center"),
  ]);

  const highScore = k.getData<number>("highScore") || 0;

  if (highScore > 0) {
    k.add([
      k.text("High Score: " + highScore, {
        size: 24,
      }),
      k.pos(k.width() / 2, k.height() / 3),

      k.anchor("center"),
    ]);
  }

  k.add([
    k.text("Press SPACE to start", {
      size: 24,
    }),
    k.pos(k.width() / 2, k.height() / 2),

    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    mainMenuAudio.stop();
    k.go("game", {});
  });

  spawnScrollingBackgroundPart();

  k.loop(3, () => {
    spawnScrollingBackgroundPart();

    const bg = k.get("background")[0];
    bg.z = -9;
    k.tween(1, 0, 0.5, (p) => {
      bg.opacity = p;
    }).then(() => bg.destroy());

    const map = k.get("map")[0];
    map.z = -9;
    k.tween(1, 0, 0.5, (p) => {
      map.opacity = p;
    }).then(() => map.destroy());
  });
});

function spawnScrollingBackgroundPart() {
  const randomMark = k.choose(getAllRebirths()).sprite;

  const room = k.choose(["Room1", "Room2", "Room3"]);

  k.add([
    k.sprite(randomMark + "_background"),
    k.scale(1000),
    k.pos(0, 0),
    k.z(-100),
    k.color(100, 100, 100),
    k.opacity(1),
    "background",
  ]);

  k.add([
    k.sprite(room + "_map_" + randomMark),
    k.scale(2),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.color(100, 100, 100),
    k.opacity(1),
    k.z(-10),
    "map",
  ]);
}
