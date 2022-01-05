module.exports = {
  collectCoverageFrom: ['**/*.{ts}', '!**/*.d.ts', '!**/node_modules/**'],
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
