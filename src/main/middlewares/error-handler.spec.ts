import { mockGraphQLError } from '@main/test'
import { ErrorHandlerMiddleware } from './error-handler'

jest.mock('@main/lib/error-middleware') // avoid console.error bug

const makeCall = (): void => {
  const error = mockGraphQLError()
  return ErrorHandlerMiddleware.handleError(error)
}

describe('ErrorHandlerMiddleware', () => {
  test('Should call sendErrorDev when in development environment', async () => {
    process.env.NODE_ENV = 'development'
    const sendErroDevSpy = jest.spyOn(ErrorHandlerMiddleware.prototype, 'sendErrorDev')
    makeCall()
    expect(sendErroDevSpy).toHaveBeenCalled()
  })

  test('Should call sendErrorProd when in production environment', async () => {
    jest.resetModules()
    process.env.NODE_ENV = 'production'
    const sendErroProdSpy = jest.spyOn(ErrorHandlerMiddleware.prototype, 'sendErrorProd')
    makeCall()
    expect(sendErroProdSpy).toHaveBeenCalled()
  })
})
