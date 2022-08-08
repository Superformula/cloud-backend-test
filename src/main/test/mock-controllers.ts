import { faker } from '@faker-js/faker'
import { Controller, HttpResponse } from '@presentation/protocols'

export class ControllerSpy implements Controller {
  request: any
  httpResponse: HttpResponse = {
    body: faker.datatype.json(),
    statusCode: faker.helpers.arrayElement([200, 201])
  }

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return this.httpResponse
  }
}
