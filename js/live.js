/* =========================================
   JOSA AI — LIVE VOICE CONTROLLER
========================================= */

"use strict";


/* =========================================
   ELEMENTS
========================================= */

const voiceSidebar = document.getElementById("voiceSidebar");
const voiceOverlay = document.getElementById("voiceOverlay");

const openVoiceSidebar = document.getElementById("openVoiceSidebar");
const closeVoiceSidebar = document.getElementById("closeVoiceSidebar");

const microphoneButton = document.getElementById("microphoneButton");
const voiceVisualizer = document.getElementById("voiceVisualizer");

const voiceStatus = document.getElementById("voiceStatus");
const voiceHeading = document.getElementById("voiceHeading");
const voiceDescription = document.getElementById("voiceDescription");

const voiceControlLabel = document.getElementById("voiceControlLabel");
const connectionStatus = document.getElementById("connectionStatus");

const voiceSelect = document.getElementById("voiceSelect");
const voiceSpeed = document.getElementById("voiceSpeed");
const autoListen = document.getElementById("autoListen");


/* =========================================
   APPLICATION STATE
========================================= */

const LiveState = {
    isListening: false,
    isSpeaking: false,
    autoListenEnabled: false,
    recognition: null,
    selectedVoice: "default",
    speechSpeed: 1
};


/* =========================================
   SIDEBAR CONTROLS
========================================= */

function openSidebar() {
    if (voiceSidebar) {
        voiceSidebar.classList.add("active");
    }

    if (voiceOverlay) {
        voiceOverlay.classList.add("active");
    }
}

function closeSidebar() {
    if (voiceSidebar) {
        voiceSidebar.classList.remove("active");
    }

    if (voiceOverlay) {
        voiceOverlay.classList.remove("active");
    }
}

openVoiceSidebar?.addEventListener("click", openSidebar);
closeVoiceSidebar?.addEventListener("click", closeSidebar);
voiceOverlay?.addEventListener("click", closeSidebar);


/* =========================================
   UI STATE
========================================= */

function updateVoiceUI(status, heading, description, controlText) {
    if (voiceStatus) {
        voiceStatus.textContent = status;
    }

    if (voiceHeading) {
        voiceHeading.textContent = heading;
    }

    if (voiceDescription) {
        voiceDescription.textContent = description;
    }

    if (voiceControlLabel) {
        voiceControlLabel.textContent = controlText;
    }
}

function setListeningState(active) {
    LiveState.isListening = active;

    voiceVisualizer?.classList.toggle("listening", active);
    microphoneButton?.classList.toggle("active", active);

    if (active) {
        updateVoiceUI(
            "Listening",
            "I'm listening...",
            "Speak naturally. JOSA AI is ready to hear you.",
            "Tap to stop listening"
        );
    } else {
        updateVoiceUI(
            "Ready",
            "Talk to JOSA",
            "Start a voice conversation with your AI companion.",
            "Tap the microphone to speak"
        );
    }
}

function setSpeakingState(active) {
    LiveState.isSpeaking = active;

    voiceVisualizer?.classList.toggle("speaking", active);

    if (active) {
        updateVoiceUI(
            "JOSA is speaking",
            "I'm responding...",
            "Please wait while JOSA AI speaks.",
            "Speaking..."
        );
    }
}


/* =========================================
   SPEECH RECOGNITION
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

function initializeRecognition() {
    if (!SpeechRecognition) {
        updateVoiceUI(
            "Unavailable",
            "Voice recognition unavailable",
            "Your browser does not support speech recognition.",
            "Try a supported browser"
        );

        if (connectionStatus) {
            connectionStatus.textContent = "Voice recognition unavailable";
        }

        return null;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setListeningState(true);
    };

    recognition.onresult = (event) => {
        const transcript =
            event.results[0][0].transcript.trim();

        console.log("User said:", transcript);

        handleVoiceInput(transcript);
    };

    recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);

        setListeningState(false);

        if (event.error === "not-allowed") {
            updateVoiceUI(
                "Permission required",
                "Microphone blocked",
                "Allow microphone access in your browser settings.",
                "Try again"
            );
        } else {
            updateVoiceUI(
                "Ready",
                "Try again",
                "I couldn't hear that clearly. Please try again.",
                "Tap to speak"
            );
        }
    };

    recognition.onend = () => {
        LiveState.isListening = false;

        voiceVisualizer?.classList.remove("listening");
        microphoneButton?.classList.remove("active");
    };

    return recognition;
}

LiveState.recognition = initializeRecognition();


/* =========================================
   START AND STOP LISTENING
========================================= */

function startListening() {
    if (!LiveState.recognition) {
        LiveState.recognition = initializeRecognition();
    }

    if (!LiveState.recognition || LiveState.isListening) {
        return;
    }

    try {
        LiveState.recognition.start();
    } catch (error) {
        console.warn("Could not start microphone:", error);
    }
}

function stopListening() {
    if (!LiveState.recognition || !LiveState.isListening) {
        return;
    }

    try {
        LiveState.recognition.stop();
    } catch (error) {
        console.warn("Could not stop microphone:", error);
    }

    setListeningState(false);
}


/* =========================================
   MICROPHONE BUTTON
========================================= */

microphoneButton?.addEventListener("click", () => {
    if (LiveState.isSpeaking) {
        window.speechSynthesis?.cancel();
        setSpeakingState(false);
        return;
    }

    if (LiveState.isListening) {
        stopListening();
    } else {
        startListening();
    }
});


/* =========================================
   VOICE RESPONSE
========================================= */

function handleVoiceInput(message) {
    if (!message) {
        return;
    }

    console.log("Processing voice message:", message);

    /*
       DEMO RESPONSE

       Replace this section later with
       your real JOSA AI backend/API.
    */

    const response =
        `I heard you say: ${message}`;

    speakResponse(response);
}


/* =========================================
   TEXT TO SPEECH
========================================= */

function speakResponse(text) {
    if (!("speechSynthesis" in window)) {
        updateVoiceUI(
            "Unavailable",
            "Speech unavailable",
            "Your browser does not support voice responses.",
            "Try another browser"
        );

        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = LiveState.speechSpeed;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
        setSpeakingState(true);
    };

    speech.onend = () => {
        setSpeakingState(false);

        if (LiveState.autoListenEnabled) {
            setTimeout(startListening, 500);
        } else {
            updateVoiceUI(
                "Ready",
                "Talk to JOSA",
                "Your voice conversation is ready.",
                "Tap the microphone to speak"
            );
        }
    };

    speech.onerror = () => {
        setSpeakingState(false);
    };

    window.speechSynthesis.speak(speech);
}


/* =========================================
   VOICE SETTINGS
========================================= */

voiceSelect?.addEventListener("change", (event) => {
    LiveState.selectedVoice = event.target.value;

    console.log(
        "Selected voice:",
        LiveState.selectedVoice
    );
});

voiceSpeed?.addEventListener("input", (event) => {
    LiveState.speechSpeed =
        Number(event.target.value) || 1;

    console.log(
        "Speech speed:",
        LiveState.speechSpeed
    );
});

autoListen?.addEventListener("click", () => {
    LiveState.autoListenEnabled =
        !LiveState.autoListenEnabled;

    autoListen.classList.toggle(
        "active",
        LiveState.autoListenEnabled
    );

    autoListen.setAttribute(
        "aria-pressed",
        String(LiveState.autoListenEnabled)
    );

    console.log(
        "Auto listen:",
        LiveState.autoListenEnabled
    );
});


/* =========================================
   INITIAL CONNECTION STATUS
========================================= */

if (connectionStatus) {
    connectionStatus.textContent =
        SpeechRecognition
            ? "Voice system ready"
            : "Speech recognition unavailable";
}


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});


/* =========================================
   INITIAL UI
========================================= */

setListeningState(false);

console.log("JOSA AI Live Voice initialized.");
