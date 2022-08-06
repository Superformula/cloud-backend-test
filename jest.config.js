module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@domain/(.*)$': '<rootDir>/src/domain/$1',
    '@data/(.*)$': '<rootDir>/src/data/$1'
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
