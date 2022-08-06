import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { mockCoordinateModel } from '@domain/test'

export class RetrieveCoordinatesRepositorySpy implements RetrieveCoordinatesHttpClient {
  address: string
  result = mockCoordinateModel()

  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesHttpClient.Result> {
    this.address = address
    return this.result
  }
}
