import { MapiResponse } from '@mapbox/mapbox-sdk/lib/classes/mapi-response'
import { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding'
import { ApolloError } from 'apollo-server-errors'
import { GeocodingFeature, GeocodingResponse } from './types/mapbox-types'

// Documentation reference: https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object

/**
 * Fetches from Mapbox the places that match the input query
 * @param query The location query
 * @returns The list of places matching the query
 */
export const FindAddressAsync = async (service: GeocodeService, query: string): Promise<GeocodingFeature[]> => {
	try {
		const geocondingQueryResponse = await service
			.forwardGeocode({
				query: query,
				mode: 'mapbox.places',
				limit: 5,
				// Exclduing POI from types because we are querying addresses
				types: ['country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'address'],
			})
			.send()

		if (!geocondingQueryResponse || !geocondingQueryResponse.body) {
			throw new ApolloError(`No valid response from Mapbox`)
		}

		checkResponseStatusCode(geocondingQueryResponse)

		// The Geocoding response is a list of places that match the most the query given
		// https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
		const geoResponse: GeocodingResponse = geocondingQueryResponse.body
		return geoResponse.features
	} catch (error) {
		throw new ApolloError(`Error on Geocoding fetch from Mapbox`, error)
	}
}

/**
 * Check response status code and throws if it's not successful
 * @param response The response received from Mapbox API, used to check status code
 */
const checkResponseStatusCode = (response: MapiResponse) => {
	const codeMod = response.statusCode % 100
	if (codeMod == 4 || codeMod == 5) {
		throw new ApolloError(`Response has no success code: ${response.statusCode}`, response.body)
	}
}
