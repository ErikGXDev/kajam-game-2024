import { k } from "../kaplay";

k.scene("mainMenu", () => {
  k.add([
    k.text("Main Menu", {
      size: 48,
      font: "monospace",
    }),
    k.pos(k.width() / 2, k.height() / 4),
    k.color(20, 20, 80),
    k.anchor("center"),
  ]);

  k.add([
    k.text("Press SPACE to start", {
      size: 24,
      font: "monospace",
    }),
    k.pos(k.width() / 2, k.height() / 2),
    k.color(20, 20, 80),
    k.anchor("center"),
  ]);

  k.onKeyPress("space", () => {
    k.go("game");
  });
});
