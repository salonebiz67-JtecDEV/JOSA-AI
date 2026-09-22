
"use strict";

const API_URL = "http://127.0.0.1:8000";

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const thinkingIndicator = document.getElementById("thinkingIndicator");


function addMessage(text, type) {
    const message = document.createElement("div");

    message.className = `message ${type}-message`;
    message.textContent = text;

    chatMessages.appendChild(message);

    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });

    return message;
}


function setThinking(visible) {
    thinkingIndicator.classList.toggle("hidden", !visible);
}


async function sendMessage(message) {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok || !response.body) {
        throw new Error("Unable to connect to JOSA.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiMessage = null;
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
            stream: true
        });

        if (!aiMessage) {
            aiMessage = addMessage("", "ai");
        }

        // Handle the initial status message.
        if (buffer.includes("[STATUS] thinking\n")) {
            buffer = buffer.replace(
                "[STATUS] thinking\n",
                ""
            );
        }

        aiMessage.textContent += buffer;
        buffer = "";
    }

    if (buffer && aiMessage) {
        aiMessage.textContent += buffer;
    }
}


chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message || sendButton.disabled) return;

    addMessage(message, "user");

    messageInput.value = "";
    sendButton.disabled = true;

    setThinking(true);

    try {
        await sendMessage(message);
    } catch (error) {
        addMessage(
            "Sorry, I couldn't connect to JOSA.",
            "ai"
        );
        console.error(error);
    } finally {
        setThinking(false);
        sendButton.disabled = false;
        messageInput.focus();
    }
});


messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});
      
