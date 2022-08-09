module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/graphql/apollo/*.ts',
    '!<rootDir>/src/**/**index.ts',
    '!<rootDir>/src/main/server.ts',
    '!<rootDir>/src/main/config/env.ts',
    '!**/test/**',
    '!**/helpers/*.ts'

  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@domain/(.*)$': '<rootDir>/src/domain/$1',
    '@data/(.*)$': '<rootDir>/src/data/$1',
    '@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '@main/(.*)$': '<rootDir>/src/main/$1'
  },
  setupFiles: ['<rootDir>/jest-env-vars.js'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
