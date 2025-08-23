/* eslint-env node, jest */
/* eslint-disable no-undef */
const path = require('path');

global.__filename = __filename; // évite no-undef si utilisé plus bas
global.rootDir = path.resolve(__dirname);

const js = require('@eslint/js');

module.exports = {
  root: true,
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/', 'eslint.config.cjs'],
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [js.configs.recommended, 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
