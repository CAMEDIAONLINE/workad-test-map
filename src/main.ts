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

let currentActiveArea: string | null = null; // Speichert die aktuelle Area
let waitToEnterArea: TArea | null;
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
        WA.room.area.onEnter(currentArea.id).subscribe(async () => {

            waitToEnterArea = currentArea;

            console.log("Aktuelle Aktive Area: ", currentActiveArea);
            console.log("OnEnterArea: ", currentArea.id);
            console.log("isClosingModal: ", isClosingModal)

            if (!currentActiveArea || currentActiveArea !== currentArea.id || isClosingModal === false) {
                console.log("OnEnter - inside if");

                if (currentActiveArea)
                    closeModal(currentActiveArea)

                // Die  Konferenz öffnen
                openJitsiModal(currentArea);
                currentActiveArea = currentArea.id;
            }
        });

        WA.room.area.onLeave(currentArea.id).subscribe(async () => {
            if (currentActiveArea && currentArea.id === currentActiveArea) {
                console.log(`Schließe Konferenz bei verlassen: ${currentArea.id}`);

                closeModal(currentArea.id)

                if (waitToEnterArea) {
                    console.log("Process waitToEnterArea: ", waitToEnterArea.id)
                    openJitsiModal(waitToEnterArea)
                }
            }
        });
    }


}).catch(e => console.error(e));


// FUNCTIONS

// Funktion zum Öffnen des modalen Jitsi-Fensters
async function openJitsiModal(currentArea: TArea) {
    if (!currentArea) {
        console.error("Kein Jitsi-Raumname vergeben!");
        return;
    }

    // Falls gerade ein Modal geschlossen wird, brechen wir ab, um doppelte Öffnungen zu vermeiden
    if (isClosingModal) {
        console.warn("Verzögertes Öffnen von Modal abgebrochen, da noch ein Schließen aktiv ist.");
        return;
    }

    // Öffne Modal
    WA.ui.modal.openModal({
        title: `Konferenz ${currentArea.label}`,
        src: `https://jitsi.camedia.tools/${currentArea.id}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right',
    }, async () => {
        console.log(`Modal für ${currentArea.id} wurde geschlossen.`);

        // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
        WA.ui.actionBar.removeButton(`disconnect-${currentArea.id}`);

        // Connect-Button wieder hinzufügen
        addJitsiConnectButton(currentArea);
    });

    // Füge Disconnect Button hinzu
    addJitsiDisconnectButton(currentArea);

    waitToEnterArea = null;
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
    isClosingModal = true;
    WA.ui.modal.closeModal(); // Altes Modal schließen

    WA.ui.actionBar.removeButton(`disconnect-${currentArea}`); // Alten Button entfernen
    WA.ui.actionBar.removeButton(`connect-${currentArea}`); // Alten Button entfernen

    // Warte kurz (weil closeModal nicht asynchron ist), bevor das neue Modal geöffnet wird
    setTimeout(() => {
        isClosingModal = false;
        currentActiveArea = null;
    }, 300); // 300ms Wartezeit, kann bei Bedarf angepasst werden    
}

export { };

