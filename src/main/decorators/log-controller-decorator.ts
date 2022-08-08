import { Controller, HttpResponse } from '@presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle<T>(httpRequest: T): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    return null
  }
}
