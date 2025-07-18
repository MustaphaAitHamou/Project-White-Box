/* .eslintrc.cjs – config ESLint complète (v9) */
module.exports = {
  root: true,

  // ───────────── Parser ─────────────
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },

  // ───────── Environnements ─────────
  env: { browser: true, es2021: true },

  // ─────────── Extends ──────────────
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended" // facultatif si Prettier installé
  ],

  // ─────────── Plugins ──────────────
  plugins: ["react", "jsx-a11y", "import", "unused-imports"],

  // ─────────── Règles ───────────────
  rules: {
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern:
          "^[A-Z_]|^(jest|describe|it|expect|beforeEach|require|__dirname|global)$",
        args: "none",
      },
    ],
    // règle temporairement désactivée — réactive‑la après nettoyage définitif
    "no-irregular-whitespace": "off",
    "prettier/prettier": "warn"
  },

  // ─────────── Ignorés ──────────────
  ignorePatterns: [
    "tools/strip-weird-spaces.js"   // script interne, pas besoin de lint
  ],

  settings: { react: { version: "detect" } },

  // ─────────── Overrides tests / configs ───────────
  overrides: [
    {
      files: [
        "**/__tests__/**/*.js",
        "**/__tests__/**/*.jsx",
        "**/*.test.js",
        "**/*.test.jsx"
      ],
      env: { jest: true, node: true },
    },
    {
      files: ["src/setupTests.js"],
      env: { jest: true, node: true },
    },
    {
      files: ["vite.config.js", "vitest.config.js", "tailwind.config.js"],
      env: { node: true },
    }
  ],
};
