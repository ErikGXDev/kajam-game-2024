import { GameObj, Grid, NavMesh, Vec2 } from "kaplay";
import { k } from "./kaplay";
import { addEnemy, addEnemySpawnPoint } from "./objects/enemies/enemy";

export async function loadMap(mapid: string) {
  k.loadJSON(mapid + "_data", `maps/${mapid}/data.json`);
  k.loadJSON(mapid + "_nav", `maps/${mapid}/nav.json`);
  k.loadSprite(mapid + "_map", `maps/${mapid}/map.png`);
}

const scale = 2;

export function getMapData(mapid: string) {
  const mapAsset = k.getAsset(mapid + "_data");

  if (!mapAsset?.loaded || !mapAsset) {
    throw new Error("Map data not loaded");
  }

  return mapAsset.data;
}

export function addNavLevel(mapid: string) {
  const navAsset = k.getAsset(mapid + "_nav");

  if (!navAsset?.loaded || !navAsset) {
    throw new Error("Nav data not loaded");
  }

  const navData = navAsset.data;

  const navMesh = new k.NavMesh();

  // NavData is a 2D array of 0s and 1s
  // 0 = not walkable
  // 1 = walkable

  navData.forEach((row: number[], y: number) => {
    row.forEach((cell: number, x: number) => {
      if (cell === 1) {
        navMesh.addRect(
          k.vec2(x, y).scale(16).scale(scale),
          k.vec2(16 * scale)
        );
      }
    });
  });

  return navMesh;
}

let currentMap: { mapData: any; mapObj: GameObj; navMesh: NavMesh } | null =
  null;

export function getCurrentMap() {
  return currentMap;
}

export function instantiateMap(mapid: string, pos: Vec2) {
  const mapObj = k.add([
    k.sprite(mapid + "_map"),
    k.pos(pos),
    k.scale(scale),
    k.anchor("topleft"),
    k.z(-10),
  ]);

  const mapData = getMapData(mapid);

  const navMesh = addNavLevel(mapid);

  getEntities(mapData, "AreaZone").forEach((zone: any) => {
    mapObj.add([
      k.rect(zone.width, zone.height),
      k.pos(zone.x, zone.y),
      k.anchor("topleft"),
      k.opacity(0),
      k.area(),
      k.body({ isStatic: true }),
      "areaZone",
    ]);
  });

  getEntities(mapData, "Enemy").forEach((enemy: any) => {
    addEnemy(
      enemy.customFields.enemyId,
      k.vec2(enemy.x, enemy.y).scale(scale).add(mapObj.pos),
      navMesh
    );
  });

  getEntities(mapData, "EnemySpawnPoint").forEach((spawnPoint: any) => {
    addEnemySpawnPoint(
      k.vec2(spawnPoint.x, spawnPoint.y).scale(scale).add(mapObj.pos),
      spawnPoint.customFields.direction
    );
  });

  console.log(mapObj.pos);

  const mapCenter = mapObj.pos.add(
    k.vec2((mapData.width * scale) / 2, (mapData.height * scale) / 2)
  );

  k.tween(
    k.camPos(),
    mapCenter,
    0.5,
    (p) => k.camPos(p),
    k.easings.easeInOutCubic
  );

  // zoom in so the map touches the screen borders
  const w = k.width();
  const h = k.height();

  const mapW = mapData.width * scale;
  const mapH = mapData.height * scale;

  const zoomProp = Math.max(w / mapW, h / mapH);

  const zoom = zoomProp / 1.5;

  k.camScale(1);

  k.tween(
    k.camScale(),
    k.vec2(zoom),
    0.5,
    (p) => k.camScale(p),
    k.easings.easeInOutCubic
  );

  let map = { mapData, mapObj, navMesh };

  currentMap = map;

  return map;
}

export function transitionMap(direction: string) {
  let directionVec = k.vec2(0, 0);
  switch (direction) {
    case "up":
      directionVec = k.vec2(0, -1);
      break;
    case "down":
      directionVec = k.vec2(0, 1);
      break;
    case "right":
      directionVec = k.vec2(1, 0);
      break;
    case "left":
      directionVec = k.vec2(-1, 0);
      break;
  }

  const newMapId = "Room2";

  instantiateMap(newMapId, directionVec.scale(1000));
}

export function getEntities(mapData: any, type: string) {
  if (!mapData.entities[type]) {
    return [];
  }

  console.log(`Got ${type} entities`, mapData.entities[type]);

  return mapData.entities[type];
}

export function getSpawnPoint(mapData: any) {
  const spawnPoint = getEntities(mapData, "SpawnPoint")[0];

  return k.vec2(spawnPoint.x, spawnPoint.y).scale(scale);
}
