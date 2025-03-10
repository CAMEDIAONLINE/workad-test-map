/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

type TArea = {
  id: string;
  label: string;
  teleport?: string;
};

// CONSTS & VARIABLES
const areas: TArea[] = [
  {
    id: "conference-room",
    label: "CAMEDIA TEAM",
    teleport: "#conference-room-entry",
  },
  {
    id: "meeting-room-1",
    label: "Larry Page",
    teleport: "#meeting-room-1-entry",
  },
  {
    id: "meeting-room-2",
    label: "Steve Jobs",
    teleport: "#meeting-room-2-entry",
  },
  {
    id: "meeting-room-3",
    label: "Roger Moore",
    teleport: "#meeting-room-3-entry",
  },
  {
    id: "meeting-room-4",
    label: "Jimmy Page",
    teleport: "#meeting-room-4-entry",
  },
  {
    id: "meeting-room-5",
    label: "Bill Gates",
    teleport: "#meeting-room-5-entry",
  },
  {
    id: "meeting-room-6",
    label: "Philipp Erich",
    teleport: "#meeting-room-6-entry",
  },
  {
    id: "pause-room",
    label: "Pause",
    teleport: "#pause-entry",
  },
];

let lastArea: TArea | null = null;
let currentButtonId: string | null = null;

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

    // Add action bar buttons
    const conferenceArea = areas.find((a) => a.id === "conference-room");
    if (conferenceArea) addTeleportButton(conferenceArea);

    for (const currentArea of areas) {
      // Event-Listener für automatisches Öffnen beim Betreten eines Bereichs
      WA.room.area
        .onEnter(currentArea.id)
        .subscribe(async () => await OnEnterArea(currentArea));
    }
  })
  .catch((e) => console.error(e));

// FUNCTIONS

async function OnEnterArea(currentArea: TArea) {
  console.log("");
  console.log("OnEnterArea: ", currentArea.id);
  console.log("  - OEA - Open currentArea: ", currentArea.id);
  lastArea = currentArea;

  // Entferne den aktuellen Button
  if (currentButtonId) WA.ui.actionBar.removeButton(currentButtonId);

  if (currentArea.id === "pause-room") {
    // Falls der Nutzer im Pause-Raum ist, Konferenzraum-Button wieder anzeigen
    const conferenceArea = areas.find((a) => a.id === "conference-room");
    if (conferenceArea) addTeleportButton(conferenceArea);
  } else {
    // Nutzer ist in einer Meeting-Area → Pause-Button anzeigen
    const pauseArea = areas.find((a) => a.id === "pause-room");
    if (pauseArea) addTeleportButton(pauseArea);
  }
}

async function addTeleportButton(toArea: TArea) {
  if (!toArea.teleport) return;

  const buttonId = `teleport-${toArea.id}`;
  currentButtonId = buttonId;

  WA.ui.actionBar.addButton({
    id: buttonId,
    label: `Zu ${toArea.label} teleportieren`,
    callback: async (event) => {
      console.log(`teleport to: ${toArea.label}`, event);
      WA.nav.goToRoom(toArea.teleport!);
    },
  });
}

export {};
