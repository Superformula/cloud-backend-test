import { mockGraphQLError } from '@main/test'
import { ErrorMiddleware } from './error-middleware'

describe('ErrorMiddleware', () => {
  test('Should log error on production environemnt', async () => {
    console.error = jest.fn()
    const graphQLError = mockGraphQLError()
    ErrorMiddleware.prototype.sendErrorProd(graphQLError)
    expect(console.error).toHaveBeenCalledWith('ERROR ', {
      path: graphQLError.path,
      code: 'INTERNAL_SERVER_ERROR',
      message: graphQLError.message,
      stack: graphQLError.originalError.stack
    })
  })
})
