import { RetrieveCoordinatesHttpClient } from '@data/protocols/http-clients/maps'
import { BadRequestError } from '@domain/errors/http-errors'
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

    const data: IForwardGeoCodingResponse = await response.json()

    if (data.features.length) {
      const [latitude, longitude] = data.features[0].center
      return {
        latitude,
        longitude
      }
    } else {
      throw new BadRequestError('No coordinates for the given address.')
    }
  }
}
