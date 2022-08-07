module.exports = {
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '@domain/(.*)$': '<rootDir>/src/domain/$1',
    '@data/(.*)$': '<rootDir>/src/data/$1',
    '@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '@presentation/(.*)$': '<rootDir>/src/presentation/$1',
    '@main/(.*)$': '<rootDir>/src/main/$1'
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
