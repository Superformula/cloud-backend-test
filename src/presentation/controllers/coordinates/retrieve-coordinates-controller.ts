import { RetrieveCoordinates } from '@domain/usecases'
import { catchError, ok } from '@presentation/helpers'
import { Controller, HttpResponse } from '@presentation/protocols'

export class RetrieveCoordinatesController implements Controller {
  constructor (private readonly retrieveCoordinates: RetrieveCoordinates) {}

  async handle (request: any): Promise<HttpResponse> {
    try {
      const { address } = request.body

      const coordinates = await this.retrieveCoordinates.retrieveCoordinates(address)
      return ok(coordinates)
    } catch (error) {
      return catchError(error)
    }
  }
}
