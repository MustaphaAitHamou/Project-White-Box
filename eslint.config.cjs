// eslint.config.js
import js             from '@eslint/js';
import globals        from 'globals';
import react          from 'eslint-plugin-react';
import jsxA11y        from 'eslint-plugin-jsx-a11y';
import reactHooks     from 'eslint-plugin-react-hooks';
import reactRefresh   from 'eslint-plugin-react-refresh';
import unusedImports  from 'eslint-plugin-unused-imports';
import importPlugin   from 'eslint-plugin-import';

export default [
  /* ------------------------------------------------------------------ */
  /* 0)  Fichiers ignorés                                               */
  /* ------------------------------------------------------------------ */
  { ignores: ['dist', 'coverage'] },

  /* ------------------------------------------------------------------ */
  /* 1)  JS / JSX “application”                                         */
  /* ------------------------------------------------------------------ */
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion : 'latest',
      sourceType  : 'module',
      globals     : { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'jsx-a11y'       : jsxA11y,
      'react-hooks'    : reactHooks,
      'react-refresh'  : reactRefresh,
      'unused-imports' : unusedImports,
      import           : importPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      /* Bases JS & React -------------------------------------------- */
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      /* Spécifiques projet ------------------------------------------ */
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars'         : ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'unused-imports/no-unused-imports' : 'error',
    },
  },

  /* ------------------------------------------------------------------ */
  /* 2)  Fichiers de tests + setupTests                                 */
  /* ------------------------------------------------------------------ */
  {
    files: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
      'src/setupTests.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType : 'module',
      globals    : { ...globals.node, jest: 'readonly' }
    },
    rules: {
      'no-undef': 'off',
      'import/no-extraneous-dependencies': 'off'
    }
  },

  /* ------------------------------------------------------------------ */
  /* 3)  Fichiers de configuration Node                                */
  /* ------------------------------------------------------------------ */
  {
    files: [
      'vite.config.js',
      'vitest.config.js',
      'tailwind.config.js',
      'jest.*.js',
      '*.config.js',
    ],
    languageOptions: {
      ecmaVersion : 'latest',
      sourceType  : 'module',
      globals     : { ...globals.node },
    },
    rules: {
      /* Pas pertinent dans les fichiers de config                     */
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
