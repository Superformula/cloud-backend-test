import { faker } from '@faker-js/faker'
import { Controller, HttpResponse } from '@presentation/protocols'

const mockHttpResponse = {
  body: faker.datatype.json(),
  statusCode: 200
}

export class ControllerMock implements Controller {
  async handle<T>(
    httpRequest: T
  ): Promise<HttpResponse> {
    return mockHttpResponse
  }
}

export class ControllerSpy implements Controller {
  request: any
  httpResponse: HttpResponse = mockHttpResponse

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return this.httpResponse
  }
}
