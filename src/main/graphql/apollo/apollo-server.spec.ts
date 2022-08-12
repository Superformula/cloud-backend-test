import 'reflect-metadata'
import { mockGraphQLError } from '@main/test'
import { checkErrorExists } from './apollo-server'

describe('ApolloServer', () => {
  test('Should return checkErrorExists false on non matching error name', async () => {
    const response = checkErrorExists(mockGraphQLError(), 'any_name')
    expect(response).toBe(false)
  })

  test('Should return checkErrorExists true on matching error name', async () => {
    const error = mockGraphQLError()
    error.name = 'any_name'
    const response = checkErrorExists(error, 'any_name')
    expect(response).toBe(true)

    error.name = 'other_name'
    error.originalError.name = 'any_name'
    const response2 = checkErrorExists(error, 'any_name')
    expect(response2).toBe(true)
  })
})
