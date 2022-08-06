import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'

export class MapBoxHttpClientAdapter implements RetrieveCoordinatesHttpClient {
  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesHttpClient.Result> {
    return null
  }
}
