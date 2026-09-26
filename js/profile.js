/* =========================================
   JOSA AI — PROFILE CONTROLLER
   Now connected to the real backend settings
   endpoint (voice, memory, tone, reminder
   style, timezone) instead of local-only
   stubs.
========================================= */

"use strict";

requireAuth();

/* =========================================
   ELEMENTS
========================================= */

const profileName = document.getElementById("profileName");
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");

const editButtons = document.querySelectorAll(".field-edit");

const settingsButton = document.getElementById("profileSettingsButton");
const signOutButton = document.getElementById("signOutButton");

const voiceToggle = document.getElementById("voiceToggle");
const memoryToggle = document.getElementById("memoryToggle");
const toneSelect = document.getElementById("toneSelect");
const notifSelect = document.getElementById("notifSelect");
const tzInput = document.getElementById("tzInput");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const saveStatusText = document.getElementById("saveStatusText");

/* =========================================
   LOCAL DISPLAY NAME
   (cosmetic only — the backend has no "name"
   field, so this stays local like before)
========================================= */

const ProfileState = {
    name: localStorage.getItem("josaProfileName") || "John"
};

function updateNameDisplay() {
    if (profileName) profileName.textContent = ProfileState.name;
    if (displayName) displayName.textContent = ProfileState.name;
}

editButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.dataset.field !== "name") return;

        const newName = window.prompt("Enter your display name:", ProfileState.name);
        if (newName === null) return;

        const cleaned = newName.trim();
        if (!cleaned) {
            window.alert("Please enter a valid name.");
            return;
        }

        ProfileState.name = cleaned;
        localStorage.setItem("josaProfileName", cleaned);
        updateNameDisplay();
    });
});

settingsButton?.addEventListener("click", () => {
    window.alert("Change preferences below, then tap \"Save changes.\"");
});

/* =========================================
   REAL SETTINGS — LOAD
========================================= */

async function loadProfile() {
    const session = await getSession();
    if (!session) return; // requireAuth() already redirects

    if (displayEmail) {
        displayEmail.textContent = session.user.email || "Not available";
    }

    try {
        const userId = await getUserId();
        const data = await callBackend(`/settings/${userId}`);
        const s = data.settings;

        if (voiceToggle) voiceToggle.checked = !!s.voice_enabled;
        if (memoryToggle) memoryToggle.checked = !!s.memory_enabled;
        if (toneSelect) toneSelect.value = s.assistant_tone || "casual";
        if (notifSelect) notifSelect.value = s.notification_style || "both";
        if (tzInput) tzInput.value = s.timezone || "";
    } catch (error) {
        console.error("Failed to load settings:", error);
        saveStatusText.textContent = "Couldn't load your settings.";
    }
}

/* =========================================
   REAL SETTINGS — SAVE
========================================= */

saveSettingsButton?.addEventListener("click", async () => {
    saveStatusText.textContent = "Saving...";

    try {
        const userId = await getUserId();

        await callBackend(`/settings/${userId}`, {
            method: "PUT",
            body: JSON.stringify({
                voiceEnabled: voiceToggle.checked,
                memoryEnabled: memoryToggle.checked,
                assistantTone: toneSelect.value,
                notificationStyle: notifSelect.value,
                timezone: tzInput.value.trim(),
            }),
        });

        saveStatusText.textContent = "Saved.";
        setTimeout(() => { saveStatusText.textContent = ""; }, 2000);
    } catch (error) {
        console.error("Failed to save settings:", error);
        saveStatusText.textContent = "Couldn't save. Please try again.";
    }
});

/* =========================================
   SIGN OUT
========================================= */

signOutButton?.addEventListener("click", async () => {
    await signOut();
});

/* =========================================
   INITIALIZE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateNameDisplay();
    loadProfile();

    console.log("JOSA AI Profile initialized.");
});
