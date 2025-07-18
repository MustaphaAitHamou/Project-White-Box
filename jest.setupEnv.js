// jest.setupEnv.js
// ---------------------------------------------------------------------------
// Variables d’environnement factices pour Jest. Aucune clé réelle n’est
// nécessaire : on évite ainsi les erreurs « … API_KEY manquant ».
// ---------------------------------------------------------------------------

process.env.VITE_GOOGLE_GEMINI_AI_API_KEY = 'test-key';
process.env.VITE_GOOGLE_PLACE_API_KEY     = 'test-key';
process.env.VITE_GOOGLE_AUTH_CLIENT_ID    = 'test-client';
process.env.VITE_RECAPTCHA_SITE_KEY       = 'test-recaptcha';
process.env.VITE_RAPIDAPI_KEY             = 'test-key';
process.env.VITE_RAPIDAPI_HOST_BOOKING    = 'booking-com.p.rapidapi.com';
