/* eslint-env jest,node */
/* global beforeAll, afterAll */

//////////////////////////////////////////////////////////////////////////////
// setupTests.js (ou setupTests.cjs) – chargé une seule fois avant les tests
//////////////////////////////////////////////////////////////////////////////

// 1)  Dépendances de test ---------------------------------------------------
import '@testing-library/jest-dom/extend-expect';
import { TextEncoder, TextDecoder } from 'util';
import { createRequire } from 'module';

// 2)  Polyfills manquants dans JSDOM / Node ---------------------------------
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// 3)  Expose un équivalent de `require` même en ESM -------------------------
const require = createRequire(import.meta.url);           // 👈
globalThis.require = require;                             // pour les libs qui l’appellent encore

// 4)  Mocks globaux pour couper le réseau & les dépendances lourdes --------
jest.mock('axios', () => {
  const mock = {
    get   : jest.fn(() => Promise.resolve({ data: {} })),
    post  : jest.fn(() => Promise.resolve({ data: {} })),
    create: () => mock,
  };
  return mock;
});

jest.mock('react-google-recaptcha', () => {
  const React = require('react');
  // Un composant factice suffisant pour les tests
  return function DummyReCAPTCHA() {
    return React.createElement('div', { 'data-testid': 'recaptcha‑mock' });
  };
});

// 5)  Filtre le bruit console.warn / console.error --------------------------
const origWarn  = console.warn.bind(console);
const origError = console.error.bind(console);

// on coupe uniquement certains messages répétitifs
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = String(args[0] ?? '');
    if (/Place photo:|Photo fetch error/i.test(msg)) return;
    origWarn(...args);
  });
});

// idem pour console.error
console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (
    msg.includes('Photo fetch error:') ||
    msg.includes('Erreur récupération photo hôtel') ||
    msg.includes('Place details error:')
  ) {
    return; // on ignore ces erreurs de test hors scope
  }
  origError(...args);
};

afterAll(() => {
  console.warn.mockRestore();
});
