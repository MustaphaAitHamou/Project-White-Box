/* eslint-env node */
/* global process, require */

/* ------------------------------------------------------------------
   Charge .env s’il existe (en CI le module peut manquer)
------------------------------------------------------------------ */
try {
    require('dotenv').config();
  } catch {
    /* pas de dotenv → on continue */
  }
  
  /* ------------------------------------------------------------------
     Valeurs de secours pour éviter les “undefined” durant les tests
  ------------------------------------------------------------------ */
  process.env.VITE_GOOGLE_GEMINI_AI_API_KEY  ??= 'test-key';
  process.env.VITE_RAPIDAPI_KEY              ??= 'rapid-test-key';
  process.env.VITE_RAPIDAPI_HOST_BOOKING     ??= 'booking-com.p.rapidapi.com';
  process.env.VITE_GOOGLE_PLACE_API_KEY      ??= 'place-test-key';
  