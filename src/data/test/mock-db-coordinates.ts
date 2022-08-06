import { RetrieveCoordinatesRepository } from '@data/protocols/http-clients/maps'
import { mockCoordinateModel } from '@domain/test'

export class RetrieveCoordinatesRepositorySpy implements RetrieveCoordinatesRepository {
  address: string
  result = mockCoordinateModel()

  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesRepository.Result> {
    this.address = address
    return this.result
  }
}
