/// <reference types="@workadventure/iframe-api-typings" />


// Imports
import {
    bootstrapExtra
    // , Properties
} from "@workadventure/scripting-api-extra";


console.log('Script started successfully');


// VARIABLES
let jitsiRoomName = "";



// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');

    // The line below bootstraps the Scripting API Extra library that 
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    // Map-Eigenschaften abrufen
    //const map = await WA.room.getTiledMap();
    //const mapProperties = new Properties(map.properties);

    // Properties aus der Karte lesen
    //jitsiRoomName = mapProperties.getString('jitsiRoom') || "";


    //console.log(`Jitsi-Raumname: ${jitsiRoomName}`);


    // Sicherstellen, dass das Dokument den Fokus hat
    document.body.setAttribute("tabindex", "0");
    document.body.focus();




    // Event-Listener für automatisches Öffnen beim Betreten eines Bereichs    
    WA.room.area.onEnter('conference-room').subscribe(() => {
        jitsiRoomName = 'conference-room'
        console.log("Open Jitsi Modal: conference Room")
        openJitsiModal();
        addJitsiButton();
    });



}).catch(e => console.error(e));


// FUNCTIONS

// Funktion zum Öffnen des modalen Jitsi-Fensters
function openJitsiModal() {
    if (!jitsiRoomName) {
        console.error("Kein Jitsi-Raumname gefunden!");
        return;
    }


    WA.ui.modal.openModal({
        title: 'Jitsi-Konferenz',
        src: `https://jitsi.camedia.tools/${jitsiRoomName}`, // Jitsi-Raum ersetzen
        allow: 'camera; microphone; fullscreen; display-capture',
        allowApi: true,
        position: 'right'
    });
}


function addJitsiButton() {

    // Add action bar button 'Join Meeting'.
    WA.ui.actionBar.addButton({
        id: 'rejoin-meeting',
        label: 'Meeting beitreten',
        callback: (event) => {
            console.log(`Rejoined meeting: ${jitsiRoomName}`, event);

            // Open Jitsi 
            openJitsiModal()

            // Remove button
            WA.ui.actionBar.removeButton('rejoin-meeting');
        }
    });

}

export { };

