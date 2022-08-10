import { faker } from '@faker-js/faker'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'
import {
  mockForwardGeoCodingResponse,
  mockForwardGeoCodingResponseUnSuccessful
} from '@infrastructure/http-clients/test'
import { MapBoxHttpClientAdapter } from './mapbox-http-client-adapter'
import { Coordinate } from '@domain/models'

jest.mock('node-fetch')

const fetch = require('node-fetch')

const { Response } = jest.requireActual('node-fetch')

describe('MapBoxHttpClientAdapter', () => {
  test('Should call fetch method with correct values', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const mapboxConfig = httpMapClientsConstants.mapbox

    const address = faker.address.city()

    const input = `${mapboxConfig.GEOCODING_BASE_URL}${mapboxConfig.GEOCODING_ENDPOINT_PLACES}${address}.json?access_token=${mapboxConfig.ACCESS_TOKEN}`

    fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockForwardGeoCodingResponse())))

    await sut.retrieveCoordinates(address)
    expect(fetch).toHaveBeenCalledWith(input, options)
  })

  test('Should return latitude and longitude if given address is correct', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const address = faker.address.city()

    const response = mockForwardGeoCodingResponse()

    fetch.mockResolvedValueOnce(new Response(JSON.stringify(response)))

    const coordinates = await sut.retrieveCoordinates(address)

    expect(coordinates).toEqual<Coordinate>({
      latitude: response.features[0].center[1],
      longitude: response.features[0].center[0]
    })
  })

  test('Should return null error if given address is incorrect', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const address = faker.address.city()

    fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockForwardGeoCodingResponseUnSuccessful())))

    const response = await sut.retrieveCoordinates(address)

    expect(response).toBe(null)
  })

  test('Should throw if fetch api throws', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const address = faker.address.city()

    fetch.mockImplementationOnce((): never => {
      throw new Error()
    })

    const promise = sut.retrieveCoordinates(address)

    await expect(promise).rejects.toThrow()
  })
})
