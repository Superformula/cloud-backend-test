import { mockGraphQLError } from '@main/test'
import 'reflect-metadata'
import { checkErrorExists } from './apollo-server'

describe('ApolloServer', () => {
  test('Should return checkErrorExists false on non matching error name', async () => {
    const response = checkErrorExists(mockGraphQLError(), 'any_name')
    expect(response).toBe(false)
  })
})
