// src/__tests__/meta-env.test.js
/* eslint-env jest, browser */
import { getEnv } from '~/lib/meta-env';

describe('getEnv', () => {
  afterEach(() => {
    // nettoyage propre
    if ('__ENV__' in window) delete window.__ENV__;
    delete globalThis.importMetaEnv;
  });

  test('lit depuis window.__ENV__ en “browser”', () => {
    Object.defineProperty(window, '__ENV__', {
      value: { FOO: 'from-browser' },
      configurable: true,
      enumerable: true,
      writable: true,
    });

    expect(getEnv('FOO', 'fallback')).toBe('from-browser');
  });

  test('lit depuis globalThis.importMetaEnv en “jest”', () => {
    globalThis.importMetaEnv = { FOO: 'from-jest' };
    expect(getEnv('FOO', 'fallback')).toBe('from-jest');
  });

  test('retourne le fallback si rien trouvé', () => {
    expect(getEnv('MISSING', 'fallback')).toBe('fallback');
  });
});
