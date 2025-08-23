// src/lib/env.vite.js
// Je centralise ici la lecture des variables d’environnement exposées par Vite.
// Remarque : import.meta.env est résolu au build, je ne fournis pas de fallback.
// Si une variable est absente, je préfère laisser échouer tôt et journaliser ailleurs.

export const VITE_EMAIL_SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
export const VITE_EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
export const VITE_EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;
