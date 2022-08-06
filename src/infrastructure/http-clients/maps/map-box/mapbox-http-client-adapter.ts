import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'

export class MapBoxHttpClientAdapter implements RetrieveCoordinatesHttpClient {
  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesHttpClient.Result> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mapboxConfig = httpMapClientsConstants.mapbox

    await fetch(
      `${mapboxConfig.GEOCODING_BASE_URL}${mapboxConfig.GEOCODING_ENDPOINT_PLACES}${address}.json?access_token=${mapboxConfig.ACCESS_TOKEN}`,
      options
    )

    return null
  }
}
