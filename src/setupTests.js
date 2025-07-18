/* eslint-env jest,node */
/* eslint-disable no-undef */
/* global require, global, __filename, beforeAll, afterAll */

///////////////////////////////////////////////////////////////////////
// 1)  Dépendances & polyfills
///////////////////////////////////////////////////////////////////////
require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// certains paquets ESM appellent encore `require` → on l’expose
const { createRequire } = require('module');
global.require = createRequire(__filename);

///////////////////////////////////////////////////////////////////////
// 2)  Mocks globaux – annule les accès réseau
///////////////////////////////////////////////////////////////////////
jest.mock('react-google-recaptcha', () => {
  const React = require('react');
  return function DummyReCAPTCHA() {
    return React.createElement('div', { 'data-testid': 'recaptcha-mock' });
  };
});

jest.mock('axios', () => {
  const mock = {
    get   : jest.fn(() => Promise.resolve({ data: {} })),
    post  : jest.fn(() => Promise.resolve({ data: {} })),
    create: () => mock,
  };
  return mock;
});

///////////////////////////////////////////////////////////////////////
// 3)  Filtre le bruit console.warn / console.error
///////////////////////////////////////////////////////////////////////
const origWarn  = console.warn;
const origError = console.error;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = String(args[0] ?? '');
    if (/Place photo:|Photo fetch error/i.test(msg)) return; // on ignore 🔇
    origWarn(...args);
  });
});

console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (
    msg.includes('Photo fetch error:') ||
    msg.includes('Erreur récupération photo hôtel') ||
    msg.includes('Place details error:')
  ) return; // on ignore 🔇
  origError(...args);
};

afterAll(() => {
  console.warn.mockRestore();
});
