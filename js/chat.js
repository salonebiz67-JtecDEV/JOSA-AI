/* =========================================
   JOSA AI — CHAT CONTROLLER
========================================= */

"use strict";

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
   SEND MESSAGE
========================================= */

function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";
    messageInput.style.height = "auto";

    /*
       Temporary demo response.
       Connect your AI backend here later.
    */

    setTimeout(() => {
        addMessage(
            "I'm ready to help you. AI connection will be added later.",
            "ai"
        );
    }, 600);
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
