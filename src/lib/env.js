/* eslint-env browser, node */

// ❌ PAS de import.meta ici, jamais.
const g = typeof globalThis !== 'undefined' ? globalThis : {};
const p = typeof process !== 'undefined' ? process.env : {};

const env = (g.importMetaEnv && typeof g.importMetaEnv === 'object')
  ? { ...g.importMetaEnv, ...p }
  : { ...p };

export default env;
