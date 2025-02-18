/// <reference types="@workadventure/iframe-api-typings" />

// Imports
import { bootstrapExtra } from "@workadventure/scripting-api-extra";


console.log('Script started successfully');


// Variables
let currentPopup: any = undefined;
let conferencePaused = false;



// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)


    // The line below bootstraps the Scripting API Extra library that 
    // adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

    // Keybinding aus der Tilemap lesen
    const pauseKey = WA.room.getProperty("keyP") || "KeyP";

    // Event für Tastendruck registrieren (P-Taste)
    WA.controls.onKeyDown(pauseKey, () => {
        toggleConference();
    });

}).catch(e => console.error(e));


// FUNCTIONS
function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function toggleConference() {
    if (!WA.room.getConference()) {
        console.warn("Jitsi-Konferenz nicht aktiv.");
        return;
    }


    if (conferencePaused) {
        WA.room.getConference()?.join();
        conferencePaused = false;
        WA.ui.displayActionMessage({
            message: "Du bist wieder in der Konferenz!",
            type: "message",
            callback: () => { }
        });
    } else {
        WA.room.getConference()?.leave();
        conferencePaused = true;
        WA.ui.displayActionMessage({
            message: "Konferenz pausiert. Drücke P, um wieder beizutreten.",
            type: "warning",
            callback: () => { }
        });
    }
}

export { };

