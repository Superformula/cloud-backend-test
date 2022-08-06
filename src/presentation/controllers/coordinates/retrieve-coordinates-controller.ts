import { RetrieveCoordinates } from '@domain/usecases'
import { Controller, HttpResponse } from '@presentation/protocols'

export class RetrieveCoordinatesController implements Controller {
  constructor (private readonly retrieveCoordinates: RetrieveCoordinates) {}

  async handle (request: any): Promise<HttpResponse> {
    const { address } = request.body
    this.retrieveCoordinates.retrieveCoordinates(address)
    return null
  }
}
