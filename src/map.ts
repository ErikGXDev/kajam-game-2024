import { GameObj, NavMesh, Vec2 } from "kaplay";
import { k } from "./kaplay";
import {
  addEnemy,
  addEnemySpawnPoint,
  spawnEnemyWave,
} from "./objects/enemies/enemy";
import { addDestroyable } from "./objects/destroyable/destroyable";

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

  console.log("Nav data", navData);

  const navMesh = new k.NavMesh();

  // NavData is a 2D array of 0s and 1s
  // 0 = not walkable
  // 1 = walkable

  let i = 0;

  navData.forEach((row: number[], y: number) => {
    row.forEach((cell: number, x: number) => {
      if (cell === 1) {
        navMesh.addRect(
          k.vec2(x, y).scale(16).scale(scale),
          k.vec2(16 * scale)
        );

        i++;
      }
    });
  });

  console.log("Added", i, "navmesh rects");

  return navMesh;
}

let currentMap: { mapData: any; mapObj: GameObj; navMesh: NavMesh } | null =
  null;

export function getCurrentMap() {
  return currentMap;
}

export function instantiateMap(mapid: string, style: string, pos: Vec2) {
  const mapObj = k.add([
    k.sprite(mapid + "_map_" + style),
    k.pos(pos),
    k.scale(scale),
    k.anchor("topleft"),
    k.z(-10),
  ]);

  const mapData = getMapData(mapid);

  const navMesh = addNavLevel(mapid);

  let map = { mapData, mapObj, navMesh };

  currentMap = map;

  k.add([
    k.sprite(style + "_background"),
    k.scale(1000),
    k.z(-100),
    k.pos(-k.width(), -k.height()),
    "background",
  ]);

  getEntities(mapData, "AreaZone").forEach((zone: any) => {
    mapObj.add([
      k.rect(zone.width, zone.height),
      k.pos(zone.x, zone.y),
      k.anchor("topleft"),
      k.opacity(0),
      k.area(),
      k.body({ isStatic: true }),
      "areaZone",
      "solid",
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

  getEntities(mapData, "Destroyable").forEach((destroyable: any) => {
    addDestroyable(
      style,
      k.vec2(destroyable.x, destroyable.y).scale(scale).add(mapObj.pos),
      2
    );
  });

  console.log(mapObj.pos);

  const mapCenter = mapObj.pos.add(
    k.vec2((mapData.width * scale) / 2, (mapData.height * scale) / 2)
  );

  k.camPos(mapCenter);

  // zoom in so the map touches the screen borders
  const w = k.width();
  const h = k.height();

  const mapW = mapData.width * scale;
  const mapH = mapData.height * scale + 64;

  // find the ratio between map and screen
  const ratio = Math.min(w / mapW, h / mapH);

  console.log("Ratio", ratio);

  const zoom = ratio;

  async function cameraControl() {
    k.camScale(1);

    k.camPos;

    await k.tween(
      k.camScale(),
      k.vec2(zoom),
      0.5,
      (p) => k.camScale(p),
      k.easings.easeInOutCubic
    );
  }

  cameraControl();

  k.wait(2).then(() => {
    spawnEnemyWave();
  });

  return map;
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
