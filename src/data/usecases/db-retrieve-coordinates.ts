import { RetrieveCoordinates } from '@domain/usecases'

export class DbRetrieveCoordinates implements RetrieveCoordinates {
  async retrieveCoordinates (address: string): Promise<RetrieveCoordinates.Result> {
    return null
  }
}
