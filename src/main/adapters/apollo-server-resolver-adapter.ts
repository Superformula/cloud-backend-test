import { MyContext } from '@main/graphql/my-context'
import { Controller } from '@presentation/protocols'

export const adaptResolver = async (controller: Controller, { req }: MyContext, args: object): Promise<any> => {
  for (const key in args) {
    req.body[key] = args[key]
  }

  const httpResponse = await controller.handle(req)
  return httpResponse.body
}
