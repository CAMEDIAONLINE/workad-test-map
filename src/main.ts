/// <reference types="@workadventure/iframe-api-typings" />


// Imports
import { bootstrapExtra, Properties } from "@workadventure/scripting-api-extra";


console.log('Script started successfully');


// Variables
let conferencePaused = false;



// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    // The line below bootstraps the Scripting API Extra library that 
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));


    // Hole die aktuelle Tiled-Karte
    const map = await WA.room.getTiledMap();

    // Initialisiere die Properties-Klasse mit den Karten-Eigenschaften
    const mapProperties = new Properties(map.properties);

    // Hole den Wert der Eigenschaft 'keyP'
    const pauseKey = mapProperties.getString('keyP') || 'KeyP';

    // Registriere das Tastendruck-Ereignis
    window.addEventListener('keydown', (event) => {
        if (event.code === pauseKey) {
            toggleConference();
        }
    });


}).catch(e => console.error(e));


// FUNCTIONS

function toggleConference() {
    if (conferencePaused) {
        WA.controls.restoreWebcam();
        WA.controls.restoreMicrophone();
        conferencePaused = false;
        WA.ui.displayActionMessage({
            message: "Du bist wieder in der Konferenz!",
            type: "message",
            callback: () => { }
        });
    } else {
        WA.controls.disableWebcam();
        WA.controls.disableMicrophone();
        conferencePaused = true;
        WA.ui.displayActionMessage({
            message: "Konferenz pausiert. Drücke P, um wieder beizutreten.",
            type: "warning",
            callback: () => { }
        });
    }
}

export { };

