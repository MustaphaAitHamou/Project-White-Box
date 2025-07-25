/* eslint-env browser, node */
/* global process */

const g = typeof globalThis !== 'undefined' ? globalThis : {};
const p = typeof process !== 'undefined' ? process.env : {};

const env = (g.importMetaEnv && typeof g.importMetaEnv === 'object')
  ? { ...g.importMetaEnv, ...p }
  : { ...p };

export default env;
