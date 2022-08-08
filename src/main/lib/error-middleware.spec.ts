import { mockGraphQLError } from '@main/test'
import { ErrorMiddleware } from './error-middleware'

describe('ErrorMiddleware', () => {
  describe('Production', () => {
    test('Should log error in production environment on INTERNAL_SERVER_ERROR', async () => {
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

    test('Should return userError with default error message in production environment on INTERNAL_SERVER_ERROR', async () => {
      const graphQLError = mockGraphQLError()
      const response = ErrorMiddleware.prototype.sendErrorProd(graphQLError)
      expect(response).toEqual({
        code: graphQLError.extensions.code,
        path: graphQLError.path,
        message: 'We are sorry, we have detected an error. Our team is working to solve it as soon as possible.'
      })
    })

    test('Should return userError with error message in production environment when no INTERNAL_SERVER_ERROR', async () => {
      const graphQLError = mockGraphQLError()
      graphQLError.extensions.code = 'BAD_USER_INPUT'
      const response = ErrorMiddleware.prototype.sendErrorProd(graphQLError)
      expect(response).toEqual({
        code: graphQLError.extensions.code,
        path: graphQLError.path,
        message: graphQLError.message
      })
    })
  })
  describe('Development', () => {
    test('Should return developerError on development environment', async () => {
      const graphQLError = mockGraphQLError()
      const response = ErrorMiddleware.prototype.sendErrorDev(graphQLError)
      expect(response).toEqual({
        path: graphQLError.path,
        code: graphQLError.extensions.code,
        message: graphQLError.message,
        stack: graphQLError.originalError.stack
      })
    })
  })
})
