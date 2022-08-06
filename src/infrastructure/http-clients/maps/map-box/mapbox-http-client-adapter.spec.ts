import { BadRequestError } from '@domain/errors/http-errors'
import { Coordinate } from '@domain/models'
import { faker } from '@faker-js/faker'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'
import {
  mockForwardGeoCodingResponse,
  mockForwardGeoCodingResponseUnSuccessful
} from '@infrastructure/http-clients/test'
import { MapBoxHttpClientAdapter } from './mapbox-http-client-adapter'

const unmockedFetch = global.fetch

describe('MapBoxHttpClientAdapter', () => {
  beforeAll(() => {
    global.fetch = (): any =>
      Promise.resolve({
        json: async () => await Promise.resolve(mockForwardGeoCodingResponse())
      })
  })

  afterAll(() => {
    global.fetch = unmockedFetch
  })

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

    const fetchSpy = jest.spyOn(global, 'fetch')

    await sut.retrieveCoordinates(address)
    expect(fetchSpy).toHaveBeenCalledWith(input, options)
  })

  test('Should return latitude and longitude if given address is correct', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const address = faker.address.city()

    const response = mockForwardGeoCodingResponse()

    const coordinates = await sut.retrieveCoordinates(address)

    expect(coordinates).toEqual<Coordinate>({
      latitude: response.features[0].center[0],
      longitude: response.features[0].center[1]
    })
  })

  test('Should return BadRequest error if given address is incorrect', async () => {
    const sut = new MapBoxHttpClientAdapter()

    const address = faker.address.city()

    jest
      .spyOn(global, 'fetch')
      .mockImplementationOnce((): any => Promise.resolve({
        json: async () => await Promise.resolve(mockForwardGeoCodingResponseUnSuccessful())
      }))

    const response = await sut.retrieveCoordinates(address)

    expect(response).toBe(null)
  })
})
