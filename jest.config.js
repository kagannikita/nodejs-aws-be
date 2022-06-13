const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleDirectories: ["node_modules", "src"],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!.serverless/**',
    '!.webpack/**',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      useESM:true
    },
  },
};
