/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import {
    bootstrapExtra
} from "@workadventure/scripting-api-extra";

type TArea = {
    id: string;
    label: string;
}

// CONSTS & VARIABLES
const areas: TArea[] = [
    {
        id: 'conference-room',
        label: 'CAMEDIA TEAM'
    },
    {
        id: 'meeting-room-1',
        label: 'Larry Page'
    },
    {
        id: 'meeting-room-2',
        label: 'Steve Jobs'
    },
    {
        id: 'meeting-room-3',
        label: 'Roger Moore'
    },
    {
        id: 'meeting-room-4',
        label: 'Jimmy Page'
    },
    {
        id: 'meeting-room-5',
        label: 'Bill Gates'
    },
    {
        id: 'meeting-room-6',
        label: 'Philipp Erich'
    }
]

let lastArea: TArea | null = null; // Speichert die letzte Area


console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');

    // The line below bootstraps the Scripting API Extra library that 
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    for (const currentArea of areas) {
        // Event-Listener für automatisches Öffnen beim Betreten eines Bereichs    
        WA.room.area.onEnter(currentArea.id).subscribe(async () => await OnEnterArea(currentArea));
    }


}).catch(e => console.error(e));


// FUNCTIONS

async function OnEnterArea(currentArea: TArea) {
    console.log("")
    console.log("OnEnterArea: ", currentArea.id)

    if (lastArea) {
        console.log("  - OEA - Close lastArea: ", lastArea.id);
        closeModal(lastArea)

        console.log("  - OEA - Wait for lastArea to be closed")
        setTimeout(() => {
            lastArea = null
            console.log("  - OEA - Wait timeout - Open: ", currentArea.id);
            openJitsiModal(currentArea);
        }, 300);

    } else {
        console.log("  - OEA - Open currentArea: ", currentArea.id);
        openJitsiModal(currentArea);
    }
}


// Funktion zum Öffnen des modalen Jitsi-Fensters
async function openJitsiModal(currentArea: TArea) {
    console.log("Open Jitsi Modal: ", currentArea.id)

    // Öffne Modal
    WA.ui.modal.openModal({
        title: `Konferenz ${currentArea.label}`,
        src: `https://jitsi.camedia.tools/${currentArea.id}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right',
    });

    // Füge Disconnect Button hinzu
    addJitsiDisconnectButton(currentArea);

    lastArea = currentArea
}


async function addJitsiConnectButton(currentArea: TArea) {

    // Add action bar button 'Join Meeting'.
    const button_id = `connect-${currentArea.id}`

    await WA.ui.actionBar.addButton({
        id: button_id,
        label: `${currentArea.label} beitreten`,
        callback: async (event) => {
            console.log(`Connected to meeting: ${currentArea}`, event);

            // Open Modal 
            await openJitsiModal(currentArea)

            // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
            WA.ui.actionBar.removeButton(button_id);
        }
    });

}

async function addJitsiDisconnectButton(currentArea: TArea) {

    // Add action bar button 'Join Meeting'.
    const button_id = `disconnect-${currentArea.id}`

    WA.ui.actionBar.addButton({
        id: button_id,
        label: `${currentArea.label} austreten`,
        callback: async (event) => {
            console.log(`disconnected from meeting: ${currentArea}`, event);

            // Close Modal            
            WA.ui.modal.closeModal();

            // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
            WA.ui.actionBar.removeButton(button_id);

            // Connect-Button wieder hinzufügen
            await addJitsiConnectButton(currentArea);
        }
    });

}


function closeModal(closeArea: TArea) {
    console.log("closeModal: ", closeArea.id)

    console.log("  - CM: Remove Buttons")
    WA.ui.actionBar.removeButton(`disconnect-${closeArea.id}`); // Alten Button entfernen
    WA.ui.actionBar.removeButton(`connect-${closeArea.id}`); // Alten Button entfernen

    console.log("  - CM: Close")
    WA.ui.modal.closeModal(); // Altes Modal schließen
}

export { };

