/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

type TArea = {
  id: string;
  label: string;
};

// CONSTS & VARIABLES
const areas: TArea[] = [
  {
    id: "conference-room",
    label: "CAMEDIA TEAM",
  },
  {
    id: "meeting-room-1",
    label: "Larry Page",
  },
  {
    id: "meeting-room-2",
    label: "Steve Jobs",
  },
  {
    id: "meeting-room-3",
    label: "Roger Moore",
  },
  {
    id: "meeting-room-4",
    label: "Jimmy Page",
  },
  {
    id: "meeting-room-5",
    label: "Bill Gates",
  },
  {
    id: "meeting-room-6",
    label: "Philipp Erich",
  },
];

// Initialisierung des Pause-Modus
let isPaused = false;
const buttonId = "pause-button";

console.log("Script started successfully");

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");

    // The line below bootstraps the Scripting API Extra library that
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));

    // Add Pause Button
    addPauseButton();
  })
  .catch((e) => console.error(e));

// FUNCTIONS

function addPauseButton() {
  // Falls ein Button mit der ID bereits existiert, zuerst entfernen
  WA.ui.actionBar.removeButton(buttonId);

  WA.ui.actionBar.addButton({
    id: buttonId,
    label: isPaused ? "Pause beenden" : "Pause starten",
    callback: togglePauseMode,
  });
}

function togglePauseMode() {
  isPaused = !isPaused;

  // Kamera & Mikrofon für sich selbst muten/unmuten
  isPaused ? WA.controls.disableMicrophone() : WA.controls.restoreMicrophone();
  isPaused ? WA.controls.disableWebcam() : WA.controls.restoreWebcam();

  // Alle anderen Teilnehmer für den eigenen Client stumm/unmuten
  document.querySelectorAll("audio").forEach((audio: HTMLAudioElement) => {
    audio.muted = isPaused;
  });

  // WA-Status setzen (geht aktuell nicht über die API)

  // Button-Label aktualisieren
  addPauseButton();

  console.log(isPaused ? "Pause aktiviert" : "Pause beendet");
}

export {};
