module.exports = {
  verbose: true,
  displayName: 'api',
  preset: 'ts-jest',
  collectCoverage: true,
  coverageReporters: ['lcov', 'json'],
  collectCoverageFrom: [
    '**/src/**/*.ts'
  ],
  transform: {
    '.+\\.(graphql|gql)$': 'jest-transform-graphql',
    "^.+\\.ts?$": "ts-jest"
  },
  moduleNameMapper: {
    '^@sf/api/(.*)$': ['<rootDir>/src/$1'],
    '^@sf/core/(.*)$': ['<rootDir>/../../packages/core/lib/generated/$1']
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'json',
    'js',
    'jsx',
    'node'
  ]
};