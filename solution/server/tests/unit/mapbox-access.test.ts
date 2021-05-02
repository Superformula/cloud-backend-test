import { jest, it, expect, describe } from '@jest/globals'
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding'
import { FindAddressAsync } from '../../src/mapbox-access'
import { mocked } from 'ts-jest/utils'
//import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request'

jest.mock('@mapbox/mapbox-sdk/services/geocoding', () => {
	return jest.fn()
})

jest.mock('@mapbox/mapbox-sdk/lib/classes/mapi-request', () => {
	return {
		MapiRequest: jest.fn().mockImplementation(() => {
			return {
				send: () => {
					return {
						body: {},
						statusCode: 200,
					}
				},
			}
		}),
	}
})

describe('Data access - DeleteUserAsync tests', () => {
	it('should FindAddressAsync work as expected', async () => {
		mocked(Geocoding).mockImplementation((): any => {
			return {
				forwardGeocode(_request: any) {
					return {
						send: () => {
							return Promise.resolve({
								body: {
									features: [],
								},
								statusCode: 200,
							})
						},
					}
				},
			}
		})

		const geocodeService = Geocoding({
			accessToken: 'token',
		})

		expect(await FindAddressAsync(geocodeService, '')).toEqual([])
	})

	it('should FindAddressAsync throw with invalid response', async () => {
		mocked(Geocoding).mockImplementation((): any => {
			return {
				forwardGeocode(_request: any) {
					return {
						send: () => {
							return Promise.resolve({
								body: null,
								statusCode: 200,
							})
						},
					}
				},
			}
		})

		const geocodeService = Geocoding({
			accessToken: 'token',
		})

		try {
			await FindAddressAsync(geocodeService, '')
		} catch (error) {
			expect(error.message).toEqual(`Error on Geocoding fetch from Mapbox`)
		}
	})

	it('should FindAddressAsync throw with failed response status code', async () => {
		mocked(Geocoding).mockImplementation((): any => {
			return {
				forwardGeocode(_request: any) {
					return {
						send: () => {
							return Promise.resolve({
								body: {
									features: [],
								},
								statusCode: 400,
							})
						},
					}
				},
			}
		})

		const geocodeService = Geocoding({
			accessToken: 'token',
		})

		try {
			await FindAddressAsync(geocodeService, '')
		} catch (error) {
			expect(error.message).toEqual(`Error on Geocoding fetch from Mapbox`)
		}
	})
})
