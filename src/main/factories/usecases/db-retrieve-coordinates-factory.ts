import { DbRetrieveCoordinates } from '@data/usecases/db-retrieve-coordinates'
import { RetrieveCoordinates } from '@domain/usecases'
import { MapBoxHttpClientAdapter } from '@infrastructure/http-clients/maps/map-box'

export const makeDbRetrieveCoordinates = (): RetrieveCoordinates => {
  const retrieveCoordinatesHttpClient = new MapBoxHttpClientAdapter()
  return new DbRetrieveCoordinates(retrieveCoordinatesHttpClient)
}
