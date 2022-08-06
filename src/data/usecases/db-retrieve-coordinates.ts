import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { RetrieveCoordinates } from '@domain/usecases'

export class DbRetrieveCoordinates implements RetrieveCoordinates {
  constructor (private readonly retrieveCoordinatesRepository: RetrieveCoordinatesHttpClient) {}

  async retrieveCoordinates (address: string): Promise<RetrieveCoordinates.Result> {
    return await this.retrieveCoordinatesRepository.retrieveCoordinates(address)
  }
}
