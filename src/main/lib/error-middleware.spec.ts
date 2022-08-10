import { mockGraphQLError } from '@main/test'
import { ErrorMiddleware } from './error-middleware'
import { IDevError, IUserError } from './interfaces'

interface SutTypes {
  graphQLError: any
  responseProd: IUserError
  responseDev: IDevError
}

const makeSut = (errorCode?: string): SutTypes => {
  const graphQLError = mockGraphQLError()
  errorCode && (graphQLError.extensions.code = errorCode)
  const responseProd = ErrorMiddleware.prototype.sendErrorProd(graphQLError)
  const responseDev = ErrorMiddleware.prototype.sendErrorDev(graphQLError)

  return {
    graphQLError,
    responseProd,
    responseDev
  }
}

describe('ErrorMiddleware', () => {
  describe('Production', () => {
    test('Should log error in production environment on INTERNAL_SERVER_ERROR', async () => {
      console.error = jest.fn()
      const { graphQLError } = makeSut()
      expect(console.error).toHaveBeenCalledWith('ERROR ', {
        path: graphQLError.path,
        code: 'INTERNAL_SERVER_ERROR',
        message: graphQLError.message,
        stack: graphQLError.originalError.stack
      })
    })

    test('Should return userError with default error message in production environment on INTERNAL_SERVER_ERROR', async () => {
      const { responseProd, graphQLError } = makeSut()
      expect(responseProd).toEqual({
        code: graphQLError.extensions.code,
        path: graphQLError.path,
        message: 'We are sorry, we have detected an error. Our team is working to solve it as soon as possible.'
      })
    })

    test('Should return userError with error message in production environment when no INTERNAL_SERVER_ERROR', async () => {
      const { responseProd, graphQLError } = makeSut('BAD_USER_INPUT')
      expect(responseProd).toEqual({
        code: graphQLError.extensions.code,
        path: graphQLError.path,
        message: graphQLError.message
      })
    })
  })

  describe('Development', () => {
    test('Should return developerError on development environment', async () => {
      const { responseDev, graphQLError } = makeSut()
      expect(responseDev).toEqual({
        path: graphQLError.path,
        code: graphQLError.extensions.code,
        message: graphQLError.message,
        stack: graphQLError.originalError.stack
      })
    })
  })
})
