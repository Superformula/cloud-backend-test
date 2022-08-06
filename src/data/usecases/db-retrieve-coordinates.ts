import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { BadRequestError } from '@domain/errors/http-errors'
import { RetrieveCoordinates } from '@domain/usecases'

export class DbRetrieveCoordinates implements RetrieveCoordinates {
  constructor (private readonly retrieveCoordinatesRepository: RetrieveCoordinatesHttpClient) {}

  async retrieveCoordinates (address: string): Promise<RetrieveCoordinates.Result> {
    const coordinates = await this.retrieveCoordinatesRepository.retrieveCoordinates(address)
    if (!coordinates) {
      throw new BadRequestError('No information found for the given address.')
    }

    return coordinates
  }
}
