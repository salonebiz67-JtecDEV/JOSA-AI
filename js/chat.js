/* =========================================
   JOSA AI — CHAT CONTROLLER
========================================= */

"use strict";

requireAuth();

if (Notification.permission === "default") {
    Notification.requestPermission();
}

/* =========================================
   ELEMENTS
========================================= */

const chatSidebar = document.getElementById("chatSidebar");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const newChatButton = document.getElementById("newChatButton");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messagesContainer");

/* =========================================
   SIDEBAR CONTROLS
========================================= */

function showSidebar() {
    chatSidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
}

function hideSidebar() {
    chatSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
}

openSidebar?.addEventListener("click", showSidebar);
closeSidebar?.addEventListener("click", hideSidebar);
sidebarOverlay?.addEventListener("click", hideSidebar);

/* =========================================
   MESSAGE HELPERS
========================================= */

function createMessage(text, type) {
    const message = document.createElement("div");

    message.className = `chat-message ${type}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = type === "user" ? "U" : "J";

    const content = document.createElement("div");
    content.className = "message-content";

    // textContent prevents HTML injection.
    content.textContent = text;

    if (type === "user") {
        message.appendChild(content);
    } else {
        message.appendChild(avatar);
        message.appendChild(content);
    }

    return message;
}

function addMessage(text, type) {
    const welcomeMessage =
        messagesContainer.querySelector(".welcome-message");

    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    const message = createMessage(text, type);

    messagesContainer.appendChild(message);

    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth"
    });
}

/* =========================================
   CONVERSATION STATE
========================================= */

let conversationId = null;

/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";
    messageInput.style.height = "auto";

    sendButton.disabled = true;

    try {
        const data = await callBackend("/chat", {
            method: "POST",
            body: JSON.stringify({
                message: message,
                conversation_id: conversationId,
            }),
        });

        conversationId = data.conversation_id;
        addMessage(data.message, "ai");

        if (data.action) {
            handleAction(data.action);
        }
    } catch (error) {
        addMessage(
            "Sorry, I couldn't reach Sana just now. Please try again.",
            "ai"
        );
        console.error(error);
    } finally {
        sendButton.disabled = false;
    }
}

/* =========================================
   ACTIONS (e.g. timers)
   A browser can't set real system alarms like
   the Android app can, so this simulates it
   with an in-tab timeout + notification +
   spoken alert. Only fires while this tab
   stays open.
========================================= */

function handleAction(action) {
    if (action.type !== "create_timer") {
        return;
    }

    const seconds = action.parameters?.duration_seconds;
    const label = action.parameters?.label || "Timer";

    if (!seconds) {
        return;
    }

    setTimeout(() => {
        if (Notification.permission === "granted") {
            new Notification(`${label} — time's up!`);
        }

        const utterance = new SpeechSynthesisUtterance(
            `${label}. Time's up.`
        );

        window.speechSynthesis.speak(utterance);
    }, seconds * 1000);
}

sendButton?.addEventListener("click", sendMessage);

/* =========================================
   ENTER TO SEND
========================================= */

messageInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

/* =========================================
   AUTO-RESIZE TEXTAREA
========================================= */

messageInput?.addEventListener("input", () => {
    messageInput.style.height = "auto";
    messageInput.style.height =
        `${Math.min(messageInput.scrollHeight, 150)}px`;
});

/* =========================================
   NEW CHAT
========================================= */

newChatButton?.addEventListener("click", () => {
    conversationId = null;

    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-logo">J</div>

            <h1>How can I help you?</h1>

            <p>
                Ask JOSA anything. Your intelligent
                companion is ready.
            </p>
        </div>
    `;

    messageInput.value = "";
    messageInput.style.height = "auto";

    hideSidebar();
});

/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideSidebar();
    }
});
