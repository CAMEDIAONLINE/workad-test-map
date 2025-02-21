/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import {
    bootstrapExtra,
    Properties
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

            openJitsiModal(currentArea);
            addJitsiDisconnectButton(currentArea);
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


    WA.ui.modal.openModal({
        title: `Konferenz ${currentArea}`,
        src: `https://jitsi.camedia.tools/${currentArea}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right'
    });
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

            // Remove button
            WA.ui.actionBar.removeButton(button_id);

            // Add Disconnect Button
            addJitsiDisconnectButton(currentArea)

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

            // Remove Disconnect Button
            WA.ui.actionBar.removeButton(button_id);

            // Add Connect Button
            addJitsiConnectButton(currentArea)
        }
    });

}


export { };

