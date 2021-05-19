import MapBoxResponse from './mapbox.response'
import GeolocationBase from '../GeolocationBase'

/**
 * Extends a GeolocationBase to get latitude and longitude coordinates based on an address
 */
export default class MapBox extends GeolocationBase {
	/**
	 * default constructor FOR A PARTICULAR GEOCODING VENDOR
	 * if NOT PUBLIC, should initialize it's api key
	 * @param address the addres to have it's coordinates fetched
	 */
	constructor(address: string) {
		super(address, false)
		this.apiKey = process.env[`MAP_BOX_ACCESS_KEY`]
	}

	/**
	 * gets the request result, and looks for a valid latitude and longitude pair
	 * @param payload the get's resquest response
	 * @returns a latitude and longitude pair
	 */
	parseResult(payload: MapBoxResponse): { lat: number; lon: number } {
		const defaultInvalidError = new Error(`invalid API response`)
		if (!payload) throw defaultInvalidError
		else {
			if (!Array.isArray(payload.features)) throw defaultInvalidError
			else if (payload.features.length === 0) throw new Error(`location not found`)

			const { geometry } = payload.features[0]!
			if (!Array.isArray(geometry) || geometry.length !== 2) throw defaultInvalidError
			else return { lat: geometry[0], lon: geometry[1] }
		}
	}
}
