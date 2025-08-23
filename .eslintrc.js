/* eslint-env node, jest */
/* eslint-disable no-undef */
const path = require('path');

// Je définis quelques globals utiles pour certains scripts/tests éventuels.
global.__filename = __filename; // évite no-undef si utilisé plus bas
global.rootDir = path.resolve(__dirname);

const js = require('@eslint/js');

module.exports = {
  // Je traite ce fichier comme racine de la config ESLint.
  root: true,

  // Je demande à ESLint d’ignorer les sorties de build, la couverture et les deps.
  // J’ajoute aussi eslint.config.cjs si présent pour éviter les conflits de double config.
  ignorePatterns: ['dist/', 'coverage/', 'node_modules/', 'eslint.config.cjs'],

  // Je travaille sur un code qui tourne côté navigateur et Node, avec Jest pour les tests.
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },

  // Je pars des règles recommandées JavaScript + React.
  extends: [js.configs.recommended, 'plugin:react/recommended'],

  // Je cible l’ECMAScript 2022 et j’utilise les modules.
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },

  // Je laisse le plugin React détecter automatiquement la version.
  settings: {
    react: { version: 'detect' },
  },

  // Ajustements ciblés :
  // - avec React 17+, je n’ai plus besoin d’importer React dans chaque fichier JSX.
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
