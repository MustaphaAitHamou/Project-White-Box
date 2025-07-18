/* eslint-env jest,node */

const { createRequire } = require('module');
global.require = createRequire(__filename);

/* 1) Polyfills jsdom */
const { TextEncoder, TextDecoder } = require('util');
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

/* 2) Matchers jest‑dom récents */
require('@testing-library/jest-dom');

/* 3) Mocks globaux */
jest.mock('react-google-recaptcha', () => {
  const React = require('react');
  return () =>
    React.createElement('div', { 'data-testid': 'recaptcha-mock' });
});

/* 4) Filtre de logs optionnel */
const origErr = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('Photo fetch error')) return;
  origErr(...args);
};
