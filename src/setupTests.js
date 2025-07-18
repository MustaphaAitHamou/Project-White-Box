/* eslint-env jest,node */
/* eslint-disable no-unused-vars */
/* global module, global, jest */

/* ------------------------------------------------------------------ */
/*  Jest – compatibilité CommonJS / ESM                               */
/* ------------------------------------------------------------------ */
import { createRequire } from 'module';
global.require = createRequire(import.meta.url);

/* ------------------------------------------------------------------ */
/*  Polyfills utiles pour jsdom                                       */
/* ------------------------------------------------------------------ */
import { TextEncoder, TextDecoder } from 'util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

/* ------------------------------------------------------------------ */
/*  Filtrer certains console.error parasites                          */
/* ------------------------------------------------------------------ */
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('Photo fetch error') ||
    msg.includes('Erreur récupération photo hôtel')
  ) {
    return; // on ignore ces messages pendant les tests
  }
  originalConsoleError(...args);
};

/* ------------------------------------------------------------------ */
/*  Mocks globaux                                                     */
/* ------------------------------------------------------------------ */
jest.mock('react-google-recaptcha', () => {
  // composant factice pour tous les tests
  return function DummyReCAPTCHA() {
    return <div data-testid="recaptcha-mock" />;
  };
});
