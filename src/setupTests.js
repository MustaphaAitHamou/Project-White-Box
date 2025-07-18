/* eslint-env jest,node */
/* global jest */

import React from 'react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

/* ---------- Polyfills -------------------------------------------------- */
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

/* ---------- Filtre console.error bruyant -------------------------------- */
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  // On ignore les erreurs de fetch de photo OU de place details dans nos composants
  if (
    msg.includes('Photo fetch error:') ||
    msg.includes('Erreur récupération photo hôtel') ||
    msg.includes('Place details error:')
  ) {
    return;
  }
  originalConsoleError(...args);
};

/* ---------- Mock minimal de react-google-recaptcha --------------------- */
jest.mock('react-google-recaptcha', () => {
  return function DummyReCAPTCHA() {
    return <div data-testid="recaptcha-mock" />;
  };
});
