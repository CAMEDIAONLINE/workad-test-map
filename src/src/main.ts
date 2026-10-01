/// <reference types="@workadventure/iframe-api-typings" />

// Importiert eine zusätzliche Scripting-Bibliothek für WorkAdventure.
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

/**
 * Definition eines Area-Typs:
 * Repräsentiert einen Bereich, in dem ein Spieler (WOKA) gespawnt werden kann.
 * - id: Eindeutige Kennung des Bereichs
 * - label: Anzeigename
 * - teleport: Die zentrale Teleport-Koordinate innerhalb dieses Bereichs
 * - spawnStart & spawnEnd: Definieren das Rechteck (Bereich) von erlaubten Spawn-Koordinaten
 */
type TArea = {
  id: string;
  label: string;
  teleport: { x: number; y: number };
  spawnStart: { x: number; y: number };
  spawnEnd: { x: number; y: number };
};

// --- KONSTANTEN & VARIABLEN ---

/**
 * Liste vordefinierter Spawn-Bereiche:
 * - conference-room: Der Hauptkonferenzraum
 * - pause-room: Ein Ruhe-/Pausebereich
 * Jeder Bereich hat definierte Grenzen für das Spawnen und einen Teleportpunkt.
 */
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

const TILE_SIZE = 32; // Kachelgröße in Pixeln

let currentButtonId: string | null = null; // Speichert aktuelle Button-ID für die Aktionsleiste
let isPaused = false; // true = im Pausenbereich, false = im Konferenzbereich
let lastPosition: string | null = null; // letzte belegte Position des Spielers

console.log("Script started successfully"); // Loggt den erfolgreichen Start

// --- INITIALISIERUNG UND EVENT HANDLING ---

WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");

    bootstrapExtra()
      .then(() => console.log("Scripting API Extra ready"))
      .catch((e) => console.error(e));

    WA.room.area.onEnter("pause-room").subscribe(() => updatePauseState(true));
    WA.room.area
      .onEnter("conference-room")
      .subscribe(() => updatePauseState(false));

    updatePauseState(isPaused);
  })
  .catch((e) => console.error(e));

// --- FUNKTIONEN ---

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
      callback: () => togglePauseMode(targetArea),
    });
  }
}

function togglePauseMode(targetArea: TArea) {
  isPaused = !isPaused;
  teleportPlayer(targetArea);
}

async function teleportPlayer(targetArea: TArea) {
  const spawnPoint = await getAvailableSpawnPoint(targetArea);
  if (spawnPoint) {
    const raw = await WA.state.loadVariable("occupiedPositions");
    const occupied = new Set<string>(
      typeof raw === "string" ? JSON.parse(raw) : []
    );

    if (lastPosition) {
      occupied.delete(lastPosition);
    }

    lastPosition = `${spawnPoint.x},${spawnPoint.y}`;
    occupied.add(lastPosition);
    await WA.state.saveVariable(
      "occupiedPositions",
      JSON.stringify([...occupied])
    );

    WA.player.teleport(spawnPoint.x, spawnPoint.y);
  }
}

async function getAvailableSpawnPoint(area: TArea) {
  const raw = await WA.state.loadVariable("occupiedPositions");
  const occupied = new Set<string>(
    typeof raw === "string" ? JSON.parse(raw) : []
  );

  const { spawnStart, spawnEnd } = area;
  const possiblePositions: { x: number; y: number }[] = [];

  for (let x = spawnStart.x; x <= spawnEnd.x; x += TILE_SIZE) {
    for (let y = spawnStart.y; y <= spawnEnd.y; y += TILE_SIZE) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
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
