import { GraphQLError } from 'graphql'
import { IDevError, IUserError } from './interfaces'

export abstract class ErrorMiddleware {
  abstract execute (error: GraphQLError): void

  private developerError (error: GraphQLError): IDevError {
    return {
      path: error.path,
      code: error.extensions.code,
      message: error.message,
      stack: error.originalError.stack
    }
  }

  private userError (error: GraphQLError): IUserError {
    return {
      code: error.extensions.code,
      path: error.path,
      message: error.extensions.code === 'INTERNAL_SERVER_ERROR'
        ? 'We are sorry, we have detected an error. Our team is working to solve it as soon as possible.'
        : error.message
    }
  }

  public sendErrorDev (error: GraphQLError): IDevError {
    // errors for dev environment
    return this.developerError(error)
  }

  public sendErrorProd (error: GraphQLError): IUserError {
    // Programming error: log the error
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error('ERROR ', this.developerError(error))
    }

    // 2) Send customized message
    return this.userError(error)
  }
}
