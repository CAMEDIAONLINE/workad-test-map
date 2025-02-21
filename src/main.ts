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
            console.log("Open Jitsi Modal: ", currentArea)

            // Falls bereits eine Konferenz offen ist -> erst schließen
            if (currentActiveArea && currentActiveArea !== currentArea.id) {
                console.log(`Schließe vorherige Konferenz: ${currentActiveArea}`);
                WA.ui.actionBar.removeButton(`disconnect-${currentActiveArea}`); // Alten Button entfernen
                WA.ui.actionBar.removeButton(`connect-${currentActiveArea}`); // Alten Button entfernen

                isClosingModal = true;
                WA.ui.modal.closeModal(); // Altes Modal schließen                

                // Warte kurz (weil closeModal nicht asynchron ist), bevor das neue Modal geöffnet wird
                setTimeout(() => {
                    isClosingModal = false;
                    openJitsiModal(currentArea);
                    currentActiveArea = currentArea.id; // Jetzt erst setzen
                }, 300); // 300ms Wartezeit, kann bei Bedarf angepasst werden

            } else {
                // Direkt die neue Konferenz öffnen, wenn keine vorherige aktiv war
                openJitsiModal(currentArea);
                currentActiveArea = currentArea.id;
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


export { };

