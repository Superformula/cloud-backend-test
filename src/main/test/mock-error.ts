import { faker } from '@faker-js/faker'

export const mockGraphQLError = (): any => ({
  message: faker.random.words(),
  locations: [
    {
      line: 2,
      column: 3
    }
  ],
  path: [faker.datatype.string()],
  extensions: {
    code: 'INTERNAL_SERVER_ERROR'
  },
  originalError: {
    stack: faker.datatype.string()
  },
  name: faker.random.word(),
  error: {
    originalError: {
      name: faker.random.word()
    }
  }
})
