import { DbRetrieveCoordinates } from '@data/usecases/db-retrieve-coordinates'
import { MapBoxHttpClientAdapter } from '@infrastructure/http-clients/maps/map-box'
import { RetrieveCoordinatesController } from '@presentation/controllers/coordinates'
import { Controller } from '@presentation/protocols'

export const makeRetrieveCoordinatesController = (): Controller => {
  const retrieveCoordinatesHttpClient = new MapBoxHttpClientAdapter()
  const dbRetrieveCoordinates = new DbRetrieveCoordinates(retrieveCoordinatesHttpClient)
  return new RetrieveCoordinatesController(dbRetrieveCoordinates)
}
