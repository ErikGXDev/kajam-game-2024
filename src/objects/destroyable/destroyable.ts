import { Vec2 } from "kaplay";
import { k } from "../../kaplay";
import { getCurrentMap } from "../../map";

export function addDestroyable(type: string, pos: Vec2, health: number) {
  const destroyable = k.add([
    k.sprite(type + "_destroyable"),
    k.scale(2),
    k.pos(pos),
    k.area(),
    k.rotate(0),
    k.body({ isStatic: true }),
    k.health(health),
    "destroyable",
    "solid",
  ]);

  destroyable.onDeath(() => {
    destroyable.destroy();

    const map = getCurrentMap();

    map?.navMesh.addRect(pos, k.vec2(16 * 2));
  });

  destroyable.onHurt(async () => {
    const orgPos = destroyable.pos.clone();
    const orgAngle = destroyable.angle;

    function shake() {
      destroyable.pos = orgPos.add(k.vec2(k.randi(-2, 2), k.randi(-2, 2)));
      destroyable.angle = k.randi(-2, 2);
    }

    for (let i = 0; i < 3; i++) {
      shake();
      await k.wait(0.02);
    }

    destroyable.pos = orgPos;
    destroyable.angle = orgAngle;
  });

  destroyable.onCollide("projectile", (projectile) => {
    destroyable.hurt(projectile.damage);
    projectile.destroy();
  });
}
