/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import {
    bootstrapExtra
} from "@workadventure/scripting-api-extra";

// CONSTS & VARIABLES
const areas = [
    'conference-room',
    'meeting-room-1',
    'meeting-room-2',
    'meeting-room-3',
    'meeting-room-4',
    'meeting-room-5',
    'meeting-room-6',
]

let currentActiveArea: string | null = null; // Speichert die aktuelle Area


console.log('Script started successfully');



// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');

    // The line below bootstraps the Scripting API Extra library that 
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));


    for (let i = 0; i < areas.length; i++) {
        const currentArea = areas[i];

        // Event-Listener für automatisches Öffnen beim Betreten eines Bereichs    
        WA.room.area.onEnter(currentArea).subscribe(() => {
            console.log("Open Jitsi Modal: ", currentArea)

            // Falls bereits eine Konferenz offen ist -> erst schließen
            if (currentActiveArea) {
                console.log(`Schließe vorherige Konferenz: ${currentActiveArea}`);
                WA.ui.modal.closeModal(); // Altes Modal schließen
                WA.ui.actionBar.removeButton(`disconnect-${currentActiveArea}`); // Alten Button entfernen
                WA.ui.actionBar.removeButton(`connect-${currentActiveArea}`); // Alten Button entfernen
            }

            openJitsiModal(currentArea);

            // Setze die aktuelle Area
            currentActiveArea = currentArea;
        });
    }


}).catch(e => console.error(e));


// FUNCTIONS

// Funktion zum Öffnen des modalen Jitsi-Fensters
function openJitsiModal(currentArea: String) {
    if (!currentArea) {
        console.error("Kein Jitsi-Raumname vergeben!");
        return;
    }

    // Öffne Modal
    WA.ui.modal.openModal({
        title: `Konferenz ${currentArea}`,
        src: `https://jitsi.camedia.tools/${currentArea}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right',
    }, () => {
        console.log(`Modal für ${currentArea} wurde geschlossen.`);

        // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
        WA.ui.actionBar.removeButton(`disconnect-${currentArea}`);

        // Connect-Button wieder hinzufügen
        addJitsiConnectButton(currentArea);
    });

    // Füge Disconnect Button hinzu
    addJitsiDisconnectButton(currentArea);


}


function addJitsiConnectButton(currentArea: String) {

    // Add action bar button 'Join Meeting'.
    const button_id = `connect-${currentArea}`

    WA.ui.actionBar.addButton({
        id: button_id,
        label: `${currentArea} beitreten`,
        callback: (event) => {
            console.log(`Connected to meeting: ${currentArea}`, event);

            // Open Modal 
            openJitsiModal(currentArea)

            // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
            WA.ui.actionBar.removeButton(button_id);
        }
    });

}

function addJitsiDisconnectButton(currentArea: String) {

    // Add action bar button 'Join Meeting'.
    const button_id = `disconnect-${currentArea}`

    WA.ui.actionBar.addButton({
        id: button_id,
        label: `${currentArea} austreten`,
        callback: (event) => {
            console.log(`disconnected from meeting: ${currentArea}`, event);

            // Close Modal
            WA.ui.modal.closeModal();

            // Entferne Disconnect-Button, wenn das Modal manuell geschlossen wurde
            WA.ui.actionBar.removeButton(button_id);

            // Connect-Button wieder hinzufügen
            addJitsiConnectButton(currentArea);
        }
    });

}


export { };

