import { GameObj, Vec2 } from "kaplay";
import { k } from "./kaplay";
import { addEnemy } from "./objects/enemies/enemy";

export async function loadMap(mapid: string) {
  k.loadJSON(mapid + "_data", `maps/${mapid}/data.json`);
  k.loadSprite(mapid + "_map", `maps/${mapid}/map.png`);
}

const scale = 3;

export function getMapData(mapid: string) {
  const mapAsset = k.getAsset(mapid + "_data");

  if (!mapAsset?.loaded || !mapAsset) {
    throw new Error("Map data not loaded");
  }

  return mapAsset.data;
}

export function instantiateMap(mapid: string, pos: Vec2) {
  const map = k.add([
    k.sprite(mapid + "_map"),
    k.pos(pos),
    k.scale(scale),
    k.anchor("topleft"),
    k.z(-10),
  ]);

  const mapData = getMapData(mapid);
  const { entities } = mapData;

  entities["AreaZone"].forEach((zone: any) => {
    map.add([
      k.rect(zone.width, zone.height),
      k.pos(zone.x, zone.y),
      k.anchor("topleft"),
      k.opacity(0),
      k.area(),
      k.body({ isStatic: true }),
      "areaZone",
    ]);
  });

  entities["Enemy"].forEach((enemy: any) => {
    addEnemy(
      enemy.customFields.enemyId,
      k.vec2(enemy.x, enemy.y).scale(scale).add(map.pos)
    );
  });

  entities["RoomLeavePoint"].forEach((point: any) => {
    const leavePoint = map.add([
      k.rect(point.width, point.height),
      k.pos(point.x, point.y),
      k.anchor("topleft"),
      k.opacity(0),
      k.area(),
      "roomLeavePoint",
    ]);

    const direction = point.customFields.direction;

    const worldPos = leavePoint.pos.scale(3).add(map.pos);

    k.add([k.circle(8), k.color(255, 0, 0), k.pos(worldPos)]);

    leavePoint.onCollide("mark", () => {
      connectMap(map, worldPos, direction);
    });
  });

  console.log(map.pos);

  k.camPos(
    map.pos.add(
      k.vec2((mapData.width * scale) / 2, (mapData.height * scale) / 2)
    )
  );

  return [mapData, map];
}

export function connectMap(
  oldMap: GameObj,
  leavePointPos: Vec2,
  direction: string
) {
  console.log(
    `Connecting to map at ${leavePointPos} in direction ${direction}`
  );

  let directionVec = k.vec2(0, 0);
  switch (direction) {
    case "n":
      directionVec = k.vec2(0, -1);
      break;
    case "s":
      directionVec = k.vec2(0, 1);
      break;
    case "e":
      directionVec = k.vec2(1, 0);
      break;
    case "w":
      directionVec = k.vec2(-1, 0);
      break;
  }

  const newMapId = "Room2";

  const screenCenter = k.camPos().add(k.width() / 2, k.height() / 2);

  const offscreenPos = screenCenter.add(directionVec.scale(1000));
  const offscreenPos2 = screenCenter.sub(directionVec.scale(1000));

  k.tween(oldMap.pos, offscreenPos2, 2, (p) => (oldMap.pos = p));

  const [mapData, newMap] = instantiateMap(newMapId, screenCenter);

  k.tween(newMap.pos, screenCenter, 2, (p) => (newMap.pos = p));
}

export function getEntities(mapData: any, type: string) {
  return mapData.entities[type];
}

export function getSpawnPoint(mapData: any) {
  const spawnPoint = getEntities(mapData, "SpawnPoint")[0];

  return k.vec2(spawnPoint.x, spawnPoint.y).scale(scale);
}
