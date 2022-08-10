import { Controller } from '@presentation/protocols'
import { ApolloError, UserInputError } from 'apollo-server-lambda'

export const adaptResolver = async (controller: Controller, args?: object, context?: any): Promise<any> => {
  const request = {
    ...(args || {})
    // here we can add contextual information
  }

  const httpResponse = await controller.handle(request)

  switch (httpResponse.statusCode) {
    case 200: return httpResponse.body
    case 400: throw new UserInputError(httpResponse.body.message)
    default: throw new ApolloError(httpResponse.body.message)
  }
}
