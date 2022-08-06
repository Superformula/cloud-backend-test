import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'
import { IForwardGeoCodingResponse } from './interfaces/Imap-box-http-client'

export class MapBoxHttpClientAdapter implements RetrieveCoordinatesHttpClient {
  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesHttpClient.Result> {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mapboxConfig = httpMapClientsConstants.mapbox

    const response: Response = await fetch(
      `${mapboxConfig.GEOCODING_BASE_URL}${mapboxConfig.GEOCODING_ENDPOINT_PLACES}${address}.json?access_token=${mapboxConfig.ACCESS_TOKEN}`,
      options
    )

    const data: IForwardGeoCodingResponse = await response.json()

    if (data.features.length) {
      const [latitude, longitude] = data.features[0].center
      return {
        latitude,
        longitude
      }
    }
  }
}
