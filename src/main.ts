/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

type TArea = {
  id: string;
  label: string;
  teleport: { x: number; y: number };
};

// CONSTS & VARIABLES
const areas: TArea[] = [
  {
    id: "conference-room",
    label: "CAMEDIA TEAM",
    teleport: { x: 390, y: 680 },
  },
  { id: "pause-room", label: "Pause", teleport: { x: 70, y: 900 } },
];

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
    WA.player.teleport(targetArea.teleport.x, targetArea.teleport.y);
  }
}
