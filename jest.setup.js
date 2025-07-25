/* eslint-env jest, node */
import React from 'react';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.React = React;
global.TextEncoder ??= TextEncoder;
global.TextDecoder ??= TextDecoder;
if (typeof window !== 'undefined' && !window.scrollTo) window.scrollTo = () => {};
globalThis.importMetaEnv ??= {
  VITE_GOOGLE_PLACE_API_KEY  : 'test-key',
  VITE_GOOGLE_GEMINI_AI_API_KEY: 'test-gemini',
  VITE_GOOGLE_AUTH_CLIENT_ID : 'test-client',
};

/* --------- Silence sélectif des erreurs console --------- */
const origError = console.error;
console.error = (...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('Photo fetch error')) return;
  origError(...args);
};