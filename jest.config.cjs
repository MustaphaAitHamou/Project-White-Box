// jestconfig.cjs
const path = require('path');

module.exports = {
  rootDir: '.',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'jsdom',
  // Ajout des extensions TS/TSX
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // Votre alias @/ → src/
    '^@/(.*)$': '<rootDir>/src/$1',

    // Vos autres alias
    '^~/(.*)$': '<rootDir>/src/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^create-trip/(.*)$': '<rootDir>/src/create-trip/$1',

    // Mock des styles
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Mock des assets
    '\\.(gif|ttf|eot|svg|png|jpe?g)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
