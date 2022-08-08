import { Controller } from '@presentation/protocols'
import { ApolloError, UserInputError } from 'apollo-server-express'
import { Request } from 'express'

export const adaptResolver = async (controller: Controller, req: Request, args: object): Promise<any> => {
  for (const key in args) {
    req.body[key] = args[key]
  }

  const httpResponse = await controller.handle(req)

  switch (httpResponse.statusCode) {
    case 200: return httpResponse.body
    case 400: throw new UserInputError(httpResponse.body.message)
  }
}
