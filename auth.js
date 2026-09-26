/* =========================================
   JOSA AI — AUTH CONTROLLER
   Loaded after config.js on every page.
   Shared by login.html and every gated page
   (chat, live, profile).
========================================= */

"use strict";

/* =========================================
   SESSION HELPERS
========================================= */

async function getSession() {
    const { data } = await supabaseClient.auth.getSession();
    return data.session;
}

async function getAccessToken() {
    const session = await getSession();
    return session ? session.access_token : null;
}

async function getUserId() {
    const session = await getSession();
    return session ? session.user.id : null;
}

/* =========================================
   PAGE GUARD
   Call this at the top of chat.js, live.js,
   and profile.js. Redirects to login if the
   user isn't signed in.
========================================= */

async function requireAuth() {
    const session = await getSession();

    if (!session) {
        window.location.href =
            window.location.pathname.includes("/pages/")
                ? "login.html"
                : "pages/login.html";
        return null;
    }

    return session;
}

/* =========================================
   SIGN IN / SIGN OUT
========================================= */

async function signInWithGoogle() {
    await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href },
    });
}

async function signOut() {
    await supabaseClient.auth.signOut();
    window.location.href =
        window.location.pathname.includes("/pages/")
            ? "../index.html"
            : "index.html";
}

/* =========================================
   BACKEND API HELPER
   Wraps fetch with the auth header and JSON
   handling so chat.js/live.js/profile.js
   don't repeat this everywhere.
========================================= */

async function callBackend(path, options = {}) {
    const token = await getAccessToken();

    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Request to Sana failed.");
    }

    return res.json();
}
