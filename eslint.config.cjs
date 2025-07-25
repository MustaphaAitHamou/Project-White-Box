/* eslint-env node */
const js            = require('@eslint/js');
const globals       = require('globals');
const react         = require('eslint-plugin-react');
const jsxA11y       = require('eslint-plugin-jsx-a11y');
const reactHooks    = require('eslint-plugin-react-hooks');
const reactRefresh  = require('eslint-plugin-react-refresh');
const unusedImports = require('eslint-plugin-unused-imports');
const importPlugin  = require('eslint-plugin-import');

module.exports = [
  /* ───────── Ignorer build & coverage ───────── */
  { ignores: ['dist', 'coverage'] },

  /* ───────── Code app (JS/JSX) ───────── */
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion  : 'latest',
      sourceType   : 'module',
      globals      : { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'jsx-a11y'      : jsxA11y,
      'react-hooks'   : reactHooks,
      'react-refresh' : reactRefresh,
      'unused-imports': unusedImports,
      import          : importPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars'                       : ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'unused-imports/no-unused-imports'     : 'error',
    },
  },

  /* ───────── Tests ───────── */
  {
    files: [
      '**/__tests__/**/*.[jt]s?(x)',
      '**/?(*.)+(spec|test).[jt]s?(x)',
      'src/setupTests.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType : 'module',
      globals    : {
        ...globals.node,
        jest       : 'readonly',
        beforeAll  : 'readonly',
        afterAll   : 'readonly',
        beforeEach : 'readonly',
        afterEach  : 'readonly',
      },
    },
    rules: { 'no-undef': 'off' },
  },

  /* ───────── Fichiers de config Node ───────── */
  {
    files: [
      'vite.config.*',
      'vitest.config.*',
      'tailwind.config.*',
      'jest.*.js',
      '*.config.js',
      '*.config.cjs',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType : 'module',
      globals    : { ...globals.node },
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
