/* eslint-env jest,node */
/* global module */

/* ------------------------------------------------------------------ */
/*  Jest – compatibilité CommonJS dans un projet ESM                  */
/* ------------------------------------------------------------------ */
import { createRequire } from 'module';
global.require = createRequire(import.meta.url);

/* ---------------- Polyfills utiles pour jsdom --------------------- */
import { TextEncoder, TextDecoder } from 'util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

/* ---------------- Filtrer certains console.error ------------------ */
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('Photo fetch error') ||
      msg.includes('Erreur récupération photo hôtel')) {
    return;
  }
  originalConsoleError(...args);
};

/* ------------- Mocks globaux (ex. reCAPTCHA invisible) ------------ */
jest.mock('react-google-recaptcha', () => {
  // composant factice
  return function DummyReCAPTCHA() {
    return <div data-testid="recaptcha-mock" />;
  };
});
