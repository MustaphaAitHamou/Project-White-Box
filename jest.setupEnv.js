/* eslint-env node */
import 'dotenv/config';                 // charge automatiquement .env

// ---------------------------------------------------------------------------
//  Variables d’environnement factices pour les tests (overrides ci‑dessous)
// ---------------------------------------------------------------------------
process.env.VITE_GOOGLE_GEMINI_AI_API_KEY  ||= 'dummy-gemini-key';
process.env.VITE_GOOGLE_PLACE_API_KEY      ||= 'dummy-place-key';
process.env.VITE_RAPIDAPI_KEY              ||= 'dummy-rapid-key';
process.env.VITE_RAPIDAPI_HOST_BOOKING     ||= 'booking-com.p.rapidapi.com';
