/* eslint-env browser, node */

/**
 * getEnv(key, fallback)
 *  - en dev/prod (Vite) : lit window.__ENV__ (injecté via index.html)
 *  - en test (Jest)     : lit globalThis.importMetaEnv (défini dans setupTests.js)
 */
export function getEnv(key, fallback = '') {
    const fromBrowser =
      typeof window !== 'undefined' &&
      window.__ENV__ &&
      Object.prototype.hasOwnProperty.call(window.__ENV__, key)
        ? window.__ENV__[key]
        : undefined;
  
    const fromJest =
      typeof globalThis !== 'undefined' &&
      globalThis.importMetaEnv &&
      Object.prototype.hasOwnProperty.call(globalThis.importMetaEnv, key)
        ? globalThis.importMetaEnv[key]
        : undefined;
  
    return fromBrowser ?? fromJest ?? fallback;
  }
  