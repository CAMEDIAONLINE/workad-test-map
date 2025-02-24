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

let lastActiveArea: string | null = null; // Speichert die aktuelle Area
let areaLeft: string | null = null;
let waitToEnterArea: TArea | null = null;
let isClosingModal: boolean = false; // Statusvariable für das Schließen


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

        // Event-Listener für automatisches Schließen beim Verlassen eines Bereichs       
        WA.room.area.onLeave(currentArea.id).subscribe(async () => await OnLeaveArea(currentArea));
    }


}).catch(e => console.error(e));


// FUNCTIONS

async function OnEnterArea(currentArea: TArea) {
    waitToEnterArea = currentArea;
    console.log("OnEnterArea: ", currentArea.id)

    if (!lastActiveArea || lastActiveArea !== currentArea.id || isClosingModal === false) {


        if (lastActiveArea) {
            console.log("  - OEA - Close lastActiveArea: ", lastActiveArea);
            closeModal(lastActiveArea)
        }


        // Die  Konferenz öffnen
        console.log("  - OEA - Open currenArea: ", currentArea.id);
        openJitsiModal(currentArea);
        lastActiveArea = currentArea.id;
    }
}

async function OnLeaveArea(currentArea: TArea) {
    console.log("OnLeaveArea: ", currentArea.id)
    if (lastActiveArea && currentArea.id === lastActiveArea) {
        console.log("  - OLA Current Area:", currentArea.id);

        if (!areaLeft || currentArea.id !== areaLeft) {
            closeModal(currentArea.id);
        }


        console.log("  - OLA - waitToEnterArea: ", waitToEnterArea)
        if (waitToEnterArea) {
            console.log("  - OLA - Process waitToEnterArea: ", waitToEnterArea.id)
            openJitsiModal(waitToEnterArea)
        }
        areaLeft = null
    } else {
        console.log("  - OLA - No Action")
    }
}


// Funktion zum Öffnen des modalen Jitsi-Fensters
async function openJitsiModal(currentArea: TArea) {
    console.log("Open Jitsi Modal: ", currentArea.id)

    if (!currentArea) {
        console.error("  OJM - Kein Jitsi-Raumname vergeben!");
        return;
    }

    // Falls gerade ein Modal geschlossen wird, brechen wir ab, um doppelte Öffnungen zu vermeiden
    if (isClosingModal) {

        // Warte kurz (weil closeModal nicht asynchron ist), bevor das neue Modal geöffnet wird
        setTimeout(() => {
            isClosingModal = false;
            lastActiveArea = null;
            console.log("  - OJM: Wait timeout after closeModal")
        }, 300); // 300ms Wartezeit, kann bei Bedarf angepasst werden    


    }


    // Öffne Modal
    WA.ui.modal.openModal({
        title: `Konferenz ${currentArea.label}`,
        src: `https://jitsi.camedia.tools/${currentArea.id}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right',
    }, async () => {
        console.log(`  OJM - Modal für ${currentArea.id} wurde geschlossen.`);

        // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
        WA.ui.actionBar.removeButton(`disconnect-${currentArea.id}`);

        // Connect-Button wieder hinzufügen
        addJitsiConnectButton(currentArea);
    });

    // Füge Disconnect Button hinzu
    addJitsiDisconnectButton(currentArea);

    waitToEnterArea = null;
    console.log("  OJM - waitToEnterArea:", waitToEnterArea)
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
            isClosingModal = true;
            WA.ui.modal.closeModal();

            // Warte kurz, bevor das Flag zurückgesetzt wird
            setTimeout(() => {
                isClosingModal = false;
            }, 300);

            // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
            WA.ui.actionBar.removeButton(button_id);

            // Connect-Button wieder hinzufügen
            await addJitsiConnectButton(currentArea);
        }
    });

}


function closeModal(currentArea: string) {
    console.log("closeModal: ", currentArea)

    isClosingModal = true;
    WA.ui.modal.closeModal(); // Altes Modal schließen

    WA.ui.actionBar.removeButton(`disconnect-${currentArea}`); // Alten Button entfernen
    WA.ui.actionBar.removeButton(`connect-${currentArea}`); // Alten Button entfernen

    areaLeft = currentArea

    console.log("  - CM: End")
}

export { };

