/* eslint-env jest,node */
/* eslint-disable no-unused-vars */
/* global module, jest, require */

import React from 'react';
import { createRequire } from 'module';
import { TextEncoder, TextDecoder } from 'util';

/* ------------------------------------------------------------------ */
/* 1) Ajoute “require” dans un module ESM pour Jest                    */
/* ------------------------------------------------------------------ */
const require = createRequire(import.meta.url);
global.require = require;

/* ------------------------------------------------------------------ */
/* 2) Polyfills indispensables pour jsdom                             */
/* ------------------------------------------------------------------ */
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

/* ------------------------------------------------------------------ */
/* 3) Filtre certains console.error bruyants pendant les tests        */
/* ------------------------------------------------------------------ */
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('Photo fetch error') ||
    msg.includes('Erreur récupération photo hôtel')
  ) {
    return; // Ignore ces messages spécifiques
  }
  originalConsoleError(...args);
};

/* ------------------------------------------------------------------ */
/* 4) Mocks globaux partagés pour toutes les suites Jest              */
/* ------------------------------------------------------------------ */
jest.mock('react-google-recaptcha', () => {
  return function DummyReCAPTCHA() {
    return <div data-testid="recaptcha-mock" />;
  };
});

/* Ajoute ici d’autres mocks globaux si nécessaire */
