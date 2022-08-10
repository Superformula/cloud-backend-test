import { ErrorMiddleware } from '@main/lib'
import { GraphQLError } from 'graphql'

export class ErrorHandlerMiddleware extends ErrorMiddleware {
  public execute (error: GraphQLError): any {
    // Here we can execute additional logic for handling errors

    return process.env.NODE_ENV === 'production' ? this.sendErrorProd(error) : this.sendErrorDev(error)
  }

  static handleError (error: GraphQLError): any {
    return new ErrorHandlerMiddleware().execute(error)
  }
}
