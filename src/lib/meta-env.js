/* eslint-env browser, node */

/**
 * Helper d’accès aux variables d’environnement côté client.
 * Je couvre deux contextes distincts avec la même API :
 *  - en dev/prod (Vite) : je lis window.__ENV__ (injecté via index.html)
 *  - en test (Jest)     : je lis globalThis.importMetaEnv (défini dans setupTests.js)
 *
 * Je garde un ordre de priorité clair : browser → jest → fallback.
 * J’utilise hasOwnProperty.call pour éviter de remonter la chaîne de prototypes.
 *
 * getEnv(key, fallback)
 *   - key      : nom de la variable (ex: 'VITE_GOOGLE_PLACE_API_KEY')
 *   - fallback : valeur de repli si je ne trouve rien (par défaut '')
 */
export function getEnv(key, fallback = '') {
  // Je tente d’abord de lire une valeur injectée au runtime côté navigateur.
  const fromBrowser =
    typeof window !== 'undefined' &&
    window.__ENV__ &&
    Object.prototype.hasOwnProperty.call(window.__ENV__, key)
      ? window.__ENV__[key]
      : undefined;

  // En contexte de tests (Jest), je me base sur un objet global simulant import.meta.env.
  const fromJest =
    typeof globalThis !== 'undefined' &&
    globalThis.importMetaEnv &&
    Object.prototype.hasOwnProperty.call(globalThis.importMetaEnv, key)
      ? globalThis.importMetaEnv[key]
      : undefined;

  // Je renvoie la première valeur disponible, sinon le fallback fourni.
  return fromBrowser ?? fromJest ?? fallback;
}
