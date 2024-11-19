import { Vec2 } from "kaplay";
import { k } from "../../kaplay";
import { playMusic, waitBeat } from "../../audio";
import { MarkObj } from "./mark";
import { worldMousePos } from "../../util";

export function addRockerMark(mark: MarkObj) {
  playMusic({
    stages: {
      stealth_1: "rocker_mark_stealth_1",
      fight_1: "rocker_mark_fight_1",
      fight_end: "rocker_mark_fight_end",
    },
    defaultStage: "stealth_1",
    bpm: 140.036,
  });

  let canPrimaryAttack = true;
  let canSecondaryAttack = true;

  mark.onMouseDown(async (m) => {
    // attack

    const mousePos = worldMousePos();

    const angle = mousePos.angle(mark.pos);

    if (m == "left" && canPrimaryAttack) {
      // Primary attack

      canPrimaryAttack = false;

      waitBeat(1).then(() => {
        canPrimaryAttack = true;
      });

      const angle = mousePos.angle(mark.pos);

      const coneAngle = 20;

      [-coneAngle, 0, coneAngle].forEach((offset) => {
        spawnNoteProjectile(mark.pos, angle + offset, 32, 300);
      });
    } else if (m == "right" && canSecondaryAttack) {
      // Secondary attack

      canSecondaryAttack = false;

      waitBeat(8).then(() => {
        canSecondaryAttack = true;
      });

      k.play("rocker_attack" + k.randi(1, 4), {
        volume: 0.25,
      });

      spawnSpeakerProjectile(mark.pos, angle);
    }
  });
}

async function spawnNoteProjectile(
  pos: Vec2,
  angle: number,
  offset: number = 0,
  speed: number
) {
  const vec = k.Vec2.fromAngle(angle);

  const randomNote = "rocker_note" + k.randi(1, 4);

  const note = k.add([
    k.sprite(randomNote),
    k.pos(vec.scale(offset).add(pos)),
    k.scale(0.5),
    k.anchor("center"),
    k.area({ scale: 0.2 }),
    {
      damage: 1,
    },
    "projectile",
  ]);

  note.onCollide("solid", () => {
    note.destroy();
  });

  note.onUpdate(() => {
    note.move(vec.scale(speed));
  });

  await k.tween(
    note.scale,
    k.vec2(1.5),
    0.3,
    (p) => (note.scale = p),
    k.easings.easeOutElastic
  );

  await k.tween(
    note.scale,
    k.vec2(0),
    0.25,
    (p) => (note.scale = p),
    k.easings.easeInSine
  );

  note.destroy();
}

async function spawnSpeakerProjectile(pos: Vec2, angle: number) {
  function notePulse() {
    k.tween(
      speaker.scale.add(k.vec2(0.3)),
      speaker.scale,
      1,
      (p) => (speaker.scale = p),
      k.easings.easeInSine
    );

    k.shake(0.5);

    const noteCount = 8;

    new Array(noteCount).fill(null).forEach(async (_, i) => {
      const angleOffset = (i * 360) / noteCount;

      spawnNoteProjectile(speaker.pos, angle + angleOffset, 0, 200);
    });
  }

  const vec = k.Vec2.fromAngle(angle);

  const speaker = k.add([
    k.sprite("speaker_note"),
    k.pos(vec.scale(32).add(pos)),
    k.scale(0.5),
    k.anchor("center"),
    k.body(),
    k.area({
      collisionIgnore: ["mark", "enemy"],
    }),
  ]);

  k.tween(
    speaker.scale,
    k.vec2(1.5),
    0.3,
    (p) => (speaker.scale = p),
    k.easings.easeOutExpo
  );

  let speed = 200;

  const e = speaker.onUpdate(() => {
    speaker.move(vec.scale(speed));
    speed *= 0.99;
  });

  await k.wait(2);

  e.cancel();

  k.play("riff2", {
    volume: 0.25,
  });

  notePulse();

  await waitBeat(2);

  notePulse();

  await waitBeat(2);

  notePulse();

  await waitBeat(1);

  await k.tween(
    speaker.scale,
    k.vec2(0),
    0.25,
    (p) => (speaker.scale = p),
    k.easings.easeInSine
  );

  speaker.destroy();
}
