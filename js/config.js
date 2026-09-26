/* =========================================
   JOSA AI — SHARED CONFIG
   Loaded before auth.js on every page.
   Requires the Supabase JS CDN script tag
   to already be loaded first.
========================================= */

"use strict";

// ---- Fill these in with your real values ----
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-public-key-here";
const BACKEND_URL = "https://sana-backend-nbi1.onrender.com";
// -----------------------------------------------

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
