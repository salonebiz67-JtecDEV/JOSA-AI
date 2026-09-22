
/* =========================================
   JOSA AI — PROFILE CONTROLLER
========================================= */

"use strict";


/* =========================================
   ELEMENTS
========================================= */

const profileName = document.getElementById("profileName");
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");

const editButtons = document.querySelectorAll(
    ".field-edit"
);

const settingsButton = document.getElementById(
    "profileSettingsButton"
);

const voicePreference = document.getElementById(
    "voicePreference"
);

const privacyPreference = document.getElementById(
    "privacyPreference"
);

const appearancePreference = document.getElementById(
    "appearancePreference"
);


/* =========================================
   PROFILE DATA
========================================= */

const ProfileState = {
    name: localStorage.getItem("josaProfileName") || "John",
    email: localStorage.getItem("josaProfileEmail") || ""
};


/* =========================================
   DISPLAY PROFILE
========================================= */

function updateProfileDisplay() {

    if (profileName) {
        profileName.textContent = ProfileState.name;
    }

    if (displayName) {
        displayName.textContent = ProfileState.name;
    }

    if (displayEmail) {
        displayEmail.textContent =
            ProfileState.email || "Not added";
    }

}


/* =========================================
   EDIT PROFILE FIELDS
========================================= */

function editProfileField(field) {

    if (field === "name") {

        const newName = window.prompt(
            "Enter your display name:",
            ProfileState.name
        );

        if (newName === null) {
            return;
        }

        const cleanedName = newName.trim();

        if (!cleanedName) {
            window.alert("Please enter a valid name.");
            return;
        }

        ProfileState.name = cleanedName;

        localStorage.setItem(
            "josaProfileName",
            cleanedName
        );

        updateProfileDisplay();

    }


    if (field === "email") {

        const newEmail = window.prompt(
            "Enter your email address:",
            ProfileState.email
        );

        if (newEmail === null) {
            return;
        }

        const cleanedEmail = newEmail.trim();

        if (
            cleanedEmail &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)
        ) {
            window.alert("Please enter a valid email.");
            return;
        }

        ProfileState.email = cleanedEmail;

        localStorage.setItem(
            "josaProfileEmail",
            cleanedEmail
        );

        updateProfileDisplay();

    }

}


/* =========================================
   EDIT BUTTON EVENTS
========================================= */

editButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const field = button.dataset.field;

        editProfileField(field);

    });

});


/* =========================================
   SETTINGS BUTTON
========================================= */

settingsButton?.addEventListener("click", () => {

    window.alert(
        "Profile settings will be expanded in a future update."
    );

});


/* =========================================
   VOICE PREFERENCE
========================================= */

voicePreference?.addEventListener("click", () => {

    window.location.href = "live.html";

});


/* =========================================
   PRIVACY PREFERENCE
========================================= */

privacyPreference?.addEventListener("click", () => {

    window.alert(
        "Privacy settings will be available soon."
    );

});


/* =========================================
   APPEARANCE PREFERENCE
========================================= */

appearancePreference?.addEventListener("click", () => {

    window.alert(
        "JOSA currently uses the premium dark theme."
    );

});


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    updateProfileDisplay();

    console.log(
        "JOSA AI Profile initialized."
    );

});
