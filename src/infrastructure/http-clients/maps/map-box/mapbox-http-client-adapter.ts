import fetch, { RequestInit, Response } from 'node-fetch'
import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'
import { IForwardGeoCodingResponse } from './interfaces'

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

    const data = await response.json() as IForwardGeoCodingResponse

    if (data?.features.length) {
      const [longitude, latitude] = data.features[0].center
      return {
        longitude,
        latitude
      }
    }

    return null
  }
}
