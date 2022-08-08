import { Response } from 'express'
import { GraphQLError } from 'graphql'

export abstract class ErrorMiddleware {
  constructor () {
    this.execute = this.execute?.bind(this)
  }

  abstract execute (error: GraphQLError): void

  private developerError (error: GraphQLError): any {
    return {
      path: error.path,
      code: error.extensions.code,
      message: error.message,
      stack: error.originalError.stack
    }
  }

  private userError (error: GraphQLError): any {
    return {
      code: error.extensions.code,
      path: error.path,
      message: error.extensions.code === 'INTERNAL_SERVER_ERROR'
        ? 'We are sorry, we have detected an error. Our team is working to solve it as soon as possible.'
        : error.message
    }
  }

  public sendErrorProd (error: GraphQLError): Response<any> {
    // Programming error: log the error
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error('ERROR ', this.developerError(error))
    }

    // 2) Send customized message
    return this.userError(error)
  }
}
