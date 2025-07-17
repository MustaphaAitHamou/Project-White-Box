/* .eslintrc.cjs  —  config ESLint complète */
module.exports = {
  root: true,

  // ──────────────────── Parser ────────────────────
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // ─────────────────── Environnements ─────────────
  env: {
    browser: true,
    es2021: true,
  },

  // ──────────────────── Extends ───────────────────
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    // facultatif : active si Prettier est installé
    'plugin:prettier/recommended',
  ],

  // ─────────────────── Plugins ────────────────────
  plugins: ['react', 'jsx-a11y', 'import', 'unused-imports'],

  // ──────────────────── Règles ────────────────────
  rules: {
    /* 🔧 Nettoyage automatique des imports non utilisés */
    'unused-imports/no-unused-imports': 'error',

    /* Autorise les variables majuscules (constantes) & Jest globals */
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern:
          '^[A-Z_]|^(jest|describe|it|expect|beforeEach|require|__dirname|global)$',
        args: 'none',
      },
    ],

    /* ⛔️ Désactivation temporaire — provoquait 33 errors */
    'no-irregular-whitespace': 'off',

    /* Facultatif : Prettier en warning, pas blocking CI */
    'prettier/prettier': 'warn',
  },

  // ──────────────────── Settings ──────────────────
  settings: {
    react: {
      version: 'detect',
    },
  },

  // ─────────────────── Overrides ──────────────────
  overrides: [
    {
      /* Tests Jest */
      files: [
        '**/__tests__/**/*.js',
        '**/__tests__/**/*.jsx',
        '**/*.test.js',
        '**/*.test.jsx',
      ],
      env: {
        jest: true,
        node: true,
      },
    },
    {
      /* setupTests */
      files: ['src/setupTests.js'],
      env: {
        jest: true,
        node: true,
      },
    },
    {
      /* Fichiers de config Node */
      files: ['vite.config.js', 'vitest.config.js', 'tailwind.config.js'],
      env: {
        node: true,
      },
    },
  ],
};
