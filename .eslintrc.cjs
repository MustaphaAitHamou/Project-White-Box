/* eslint-env node */
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { presets: ['@babel/preset-react'] },
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: ['react', 'jsx-a11y', 'import', 'unused-imports'],
  rules: {
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern:
          '^[A-Z_]|^(jest|describe|it|expect|beforeEach|require|__dirname|global)$',
        args: 'none',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
  },
  settings: { react: { version: 'detect' } },

  /* ------------------------------------------------------------------
     Overrides spécifiques
  ------------------------------------------------------------------ */
  overrides: [
    /* Fichiers de test */
    {
      files: [
        '**/__tests__/**/*.js',
        '**/__tests__/**/*.jsx',
        '**/*.test.js',
        '**/*.test.jsx',
      ],
      env: { jest: true, node: true },
    },

    /* setupTests.js : jest + node + global + module */
    {
      files: ['src/setupTests.js'],
      env: { jest: true, node: true },
      globals: {
        global:  'readonly',
        module:  'readonly',
      },
    },

    /* fichiers de config Node */
    {
      files: ['vite.config.js', 'vitest.config.js', 'tailwind.config.js'],
      env: { node: true },
    },
  ],
};
