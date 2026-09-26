/* =========================================
   JOSA AI — HOME CONTROLLER
   The home page is public (no requireAuth
   guard) — it's the landing page. This just
   personalizes the greeting if a session
   already exists, so returning users see
   their own name instead of a generic one.
========================================= */

"use strict";

const heroGreeting = document.getElementById("heroGreeting");

async function personalizeGreeting() {
    if (!heroGreeting) return;

    try {
        const session = await getSession();
        if (!session) return;

        const fullName = session.user.user_metadata?.full_name;
        const firstName = fullName ? fullName.split(" ")[0] : null;

        heroGreeting.textContent = firstName
            ? `Hi, ${firstName},`
            : "Welcome back,";
    } catch (error) {
        // Not signed in, or Supabase not configured yet — the
        // page still works fine with the default "Hello," text.
        console.warn("Could not check session for greeting:", error);
    }
}

document.addEventListener("DOMContentLoaded", personalizeGreeting);
