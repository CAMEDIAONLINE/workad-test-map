/// <reference types="@workadventure/iframe-api-typings" />
/// <reference path="./jitsi.d.ts" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

// Jitsi IFrame API einbinden
const JITSI_SCRIPT_URL = "https://meet.jit.si/external_api.js";

type TArea = {
  id: string;
  label: string;
};

// CONSTS & VARIABLES
const areas: TArea[] = [
  { id: "conference-room", label: "CAMEDIA TEAM" },
  { id: "meeting-room-1", label: "Larry Page" },
  { id: "meeting-room-2", label: "Steve Jobs" },
  { id: "meeting-room-3", label: "Roger Moore" },
  { id: "meeting-room-4", label: "Jimmy Page" },
  { id: "meeting-room-5", label: "Bill Gates" },
  { id: "meeting-room-6", label: "Philipp Erich" },
];

// Jitsi API Instanz speichern
let jitsiAPI: any = null;

console.log("Script started successfully");

// 📌 **Jitsi API Script dynamisch einbinden**
function loadJitsiAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${JITSI_SCRIPT_URL}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = JITSI_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject("Jitsi API konnte nicht geladen werden.");
    document.head.appendChild(script);
  });
}

// 📌 **WorkAdventure Initialisierung**
WA.onInit()
  .then(async () => {
    console.log("Scripting API ready");

    // Scripting API Extra laden
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));

    // Jitsi API laden
    await loadJitsiAPI();
    console.log("Jitsi API geladen.");

    // Event-Listener für betretene Bereiche setzen
    for (const currentArea of areas) {
      WA.room.area
        .onEnter(currentArea.id)
        .subscribe(async () => await OnEnterArea(currentArea));
      WA.room.area
        .onLeave(currentArea.id)
        .subscribe(async () => await OnLeaveArea(currentArea));
    }
  })
  .catch((e) => console.error(e));

// 📌 **Benutzer betritt einen Jitsi-Bereich**
async function OnEnterArea(currentArea: TArea) {
  console.log(`OnEnterArea: ${currentArea.id}`);

  // Sicherstellen, dass kein veralteter Button existiert
  WA.ui.actionBar.removeButton(`reconnect-${currentArea.id}`);

  // Jitsi wird durch WorkAdventure automatisch gestartet -> wir setzen nur das Event
  setTimeout(() => {
    initJitsiAPI(currentArea);
  }, 2000); // Delay, um sicherzustellen, dass Jitsi geladen ist
}

// 📌 **Jitsi API Instanz überwachen**
function initJitsiAPI(currentArea: TArea) {
  if (!window.JitsiMeetExternalAPI) {
    console.warn("JitsiMeetExternalAPI nicht verfügbar.");
    return;
  }

  // Jitsi API Instanz erstellen
  jitsiAPI = new window.JitsiMeetExternalAPI("jitsi.camedia.tools", {
    roomName: currentArea.id,
    width: 1,
    height: 1,
    parentNode: document.body,
  });

  // 📌 **Event: Teilnehmer verlässt Jitsi**
  jitsiAPI.addEventListener("participantLeft", () => {
    console.log(`User hat die Jitsi-Konferenz verlassen: ${currentArea.label}`);
    addJitsiReconnectButton(currentArea);
  });

  // 📌 **Event: Teilnehmer betritt Jitsi (entfernt den Reconnect-Button)**
  jitsiAPI.addEventListener("participantJoined", () => {
    console.log(
      `User hat die Jitsi-Konferenz erneut betreten: ${currentArea.label}`
    );
    WA.ui.actionBar.removeButton(`reconnect-${currentArea.id}`);
  });
}

// 📌 **Reconnect-Button hinzufügen**
async function addJitsiReconnectButton(currentArea: TArea) {
  const button_id = `reconnect-${currentArea.id}`;

  WA.ui.actionBar.addButton({
    id: button_id,
    label: `Erneut ${currentArea.label} beitreten`,
    callback: async () => {
      console.log(`Reconnect zu Jitsi: ${currentArea.label}`);

      // Erneut mit Jitsi verbinden
      if (window.JitsiMeetExternalAPI) {
        jitsiAPI.executeCommand("start"); // Sollte die Verbindung erneut aufbauen
      } else {
        console.warn("JitsiMeetExternalAPI nicht verfügbar.");
      }

      // Button entfernen, da Meeting wieder läuft
      WA.ui.actionBar.removeButton(button_id);
    },
  });
}

// 📌 **Benutzer verlässt einen Jitsi-Bereich**
async function OnLeaveArea(currentArea: TArea) {
  console.log(`OnLeaveArea: ${currentArea.id}`);

  // Jitsi API beenden
  if (jitsiAPI) {
    jitsiAPI.dispose();
    jitsiAPI = null;
  }

  // Reconnect-Button entfernen
  WA.ui.actionBar.removeButton(`reconnect-${currentArea.id}`);
}
