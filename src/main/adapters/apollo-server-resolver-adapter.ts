import { Controller } from '@presentation/protocols'
import { Request } from 'express'

export const adaptResolver = async (controller: Controller, req: Request, args: object): Promise<any> => {
  for (const key in args) {
    req.body[key] = args[key]
  }

  const httpResponse = await controller.handle(req)
  return httpResponse.body
}
