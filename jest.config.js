module.exports = {
  projects: [
    '<rootDir>/packages/api/jest.config.js'
  ],
  moduleNameMapper: {
    '^@sf/api/(.*)': ['<rootDir>/packages/api/src/$1'],
    '^@sf/core/(.*)': ['<rootDir>/packages/core/lib/generated/$1']
  },
};
