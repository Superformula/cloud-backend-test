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

  public sendErrorProd (error: GraphQLError): void {
    // Programming error: log the error
    if (error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error('ERROR ', this.developerError(error))
    }
  }
}
