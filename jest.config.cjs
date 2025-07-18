/* jest.config.cjs */
const path = require('path');

module.exports = {
  // Racine du dépôt
  rootDir: '.',

  // Où Jest doit chercher les modules
  moduleDirectories: ['node_modules', 'src'],

  // Environnement DOM simulé
  testEnvironment: 'jsdom',

  // Extensions reconnues
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Transpile JSX / TSX via Babel
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  // Alias de chemins (doit refléter vos alias Vite / webpack)
  moduleNameMapper: {
    '^@/(.*)$'        : '<rootDir>/src/$1',
    '^~/(.*)$'        : '<rootDir>/src/$1',
    '^utils/(.*)$'    : '<rootDir>/src/utils/$1',
    '^services/(.*)$' : '<rootDir>/src/services/$1',
    '^components/(.*)': '<rootDir>/src/components/$1',
    '^create-trip/(.*)': '<rootDir>/src/create-trip/$1',
    // Mock des fichiers de style
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Mock des fichiers statiques
    '\\.(gif|ttf|eot|svg|png|jpe?g)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Charge d’abord les variables d’environnement factices,
  // puis le bootstrap Testing Library / polyfills
  setupFiles: ['<rootDir>/jest.setupEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Ignorer la transpilation de certains modules si besoin :
  // transformIgnorePatterns: ['/node_modules/(?!un-es-module-to-transpile)'],
};
