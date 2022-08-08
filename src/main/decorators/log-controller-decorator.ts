import { Controller, HttpResponse } from '@presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle<T>(httpRequest: T): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    // if (httpResponse.statusCode === 500 && process.env.NODE_ENV === 'production') {
    // const log: Log = createLog(httpRequest, httpResponse)

    // here we can make use of a service to create a log in the database to save critical errors
    // of course we only want to do this in production

    // await this.logErrorRepository.logError(log)
    // }
    return httpResponse
  }
}
