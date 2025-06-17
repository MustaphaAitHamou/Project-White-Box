const path = require('path');


module.exports = {
    rootDir: '.',
    moduleDirectories: ['node_modules', 'src'],
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^~/(.*)$': '<rootDir>/src/$1',
        '^utils/(.*)$': '<rootDir>/src/utils/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
        '^components/(.*)$': '<rootDir>/src/components/$1',
        '^create-trip/(.*)$': '<rootDir>/src/create-trip/$1',
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.js',
      },
      
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };
