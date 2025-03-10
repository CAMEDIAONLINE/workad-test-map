/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

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

  if (isPaused) {
    // Kamera & Mikrofon für sich selbst muten/unmuten
    WA.controls.disableMicrophone();
    WA.controls.disableWebcam();
    console.log("Kamera & Mikrofon für sich selbst deaktiviert");

    // Alle anderen Teilnehmer für den eigenen Client stumm/unmuten
    document.querySelectorAll("audio").forEach((audio: HTMLAudioElement) => {
      audio.muted = isPaused;
    });
    console.log("Audio für sich selbst deaktiviert");
  } else {
    // Kamera & Mikrofon für sich selbst muten/unmuten
    WA.controls.restoreMicrophone();
    WA.controls.restoreWebcam();
    console.log("Kamera & Mikrofon für sich selbst aktiviert");

    // Alle anderen Teilnehmer für den eigenen Client stumm/unmuten
    document.querySelectorAll("audio").forEach((audio: HTMLAudioElement) => {
      audio.muted = isPaused;
    });
    console.log("Audio für sich selbst aktiviert");
  }

  // WA-Status setzen (geht aktuell nicht über die API)

  // Button-Label aktualisieren
  addPauseButton();

  console.log(isPaused ? "Pause aktiviert" : "Pause beendet");
}

export {};
