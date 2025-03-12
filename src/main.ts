/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

type TArea = {
  id: string;
  label: string;
  teleport: { x: number; y: number };
  spawnStart: { x: number; y: number };
  spawnEnd: { x: number; y: number };
};

// CONSTS & VARIABLES
const areas: TArea[] = [
  {
    id: "conference-room",
    label: "CAMEDIA TEAM",
    teleport: { x: 600, y: 750 },
    spawnStart: { x: 576, y: 736 },
    spawnEnd: { x: 672, y: 800 },
  },
  {
    id: "pause-room",
    label: "Pause",
    teleport: { x: 240, y: 976 },
    spawnStart: { x: 160, y: 896 },
    spawnEnd: { x: 288, y: 992 },
  },
];

const occupiedPositions: Set<string> = new Set();
const TILE_SIZE = 32;

let currentButtonId: string | null = null;
let isPaused = false;

console.log("Script started successfully");

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");

    bootstrapExtra()
      .then(() => console.log("Scripting API Extra ready"))
      .catch((e) => console.error(e));

    // Setze den Status basierend auf der Startposition
    WA.room.area.onEnter("pause-room").subscribe(() => updatePauseState(true));
    WA.room.area
      .onEnter("conference-room")
      .subscribe(() => updatePauseState(false));

    // Initialen Button setzen
    updatePauseState(isPaused);
  })
  .catch((e) => console.error(e));

// FUNCTIONS

function updatePauseState(paused: boolean) {
  isPaused = paused;
  setPauseButton();
}

function setPauseButton() {
  if (currentButtonId) {
    WA.ui.actionBar.removeButton(currentButtonId);
  }

  const targetArea = isPaused
    ? areas.find((a) => a.id === "conference-room")
    : areas.find((a) => a.id === "pause-room");

  if (targetArea) {
    const buttonId = `teleport-${targetArea.id}`;
    currentButtonId = buttonId;

    WA.ui.actionBar.addButton({
      id: buttonId,
      label: isPaused ? "Pause beenden" : "Pause starten",
      callback: togglePauseMode,
    });
  }
}

function togglePauseMode() {
  isPaused = !isPaused;

  const targetArea = isPaused
    ? areas.find((a) => a.id === "pause-room")
    : areas.find((a) => a.id === "conference-room");

  if (targetArea) {
    teleportPlayer(targetArea);
    // WA.player.teleport(targetArea.teleport.x, targetArea.teleport.y);
  }
}

function teleportPlayer(targetArea: TArea) {
  const spawnPoint = getAvailableSpawnPoint(targetArea);
  if (spawnPoint) {
    occupiedPositions.add(`${spawnPoint.x},${spawnPoint.y}`);
    WA.player.teleport(spawnPoint.x, spawnPoint.y);
  }
}

function getAvailableSpawnPoint(area: TArea) {
  const { spawnStart, spawnEnd } = area;
  const possiblePositions: { x: number; y: number }[] = [];

  for (let x = spawnStart.x; x <= spawnEnd.x; x += TILE_SIZE) {
    for (let y = spawnStart.y; y <= spawnEnd.y; y += TILE_SIZE) {
      if (!occupiedPositions.has(`${x},${y}`)) {
        possiblePositions.push({ x, y });
      }
    }
  }

  if (possiblePositions.length > 0) {
    return possiblePositions[
      Math.floor(Math.random() * possiblePositions.length)
    ];
  }
  return null;
}
