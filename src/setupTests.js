/* eslint-env jest,node */

// --- CommonJS require dans ESM (Jest) ---
import { createRequire } from 'module';
global.require = createRequire(import.meta.url);

// --- Testing Library ---
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Fallback pour TextEncoder/TextDecoder en environnement de test
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Suppression des console.error indésirables pour les tests
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('Photo fetch error:') ||
      msg.includes('Erreur récupération photo hôtel')) {
    return;
  }
  originalConsoleError(...args);
};

// Mock minimaliste de react-google-recaptcha
jest.mock('react-google-recaptcha', () => {
  return function DummyReCAPTCHA() {
    return <div data-testid="recaptcha-mock" />;
  };
});
