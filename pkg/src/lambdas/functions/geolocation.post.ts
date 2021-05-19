/* eslint-disable */
// import { APIGatewayProxyEvent } from 'aws-lambda'
// import LambdaRequest from '../types/lamdaRequest'
// import LambdaResponse from '../types/lambdaResponse'

// import geocodeSchema from '../schemas/geocode-schema'
import MapBox from '../../geolocation/mapbox/mapbox.geo'

/**
 * fetchs lat and long coordinates by checking the given address
 * with the given provider
 * @param e the lambda's request object
 */
export const geolocationPost = async (/* e: APIGatewayProxyEvent */) =>
{
	// const payload = LambdaRequest.validate(e, geocodeSchema)

	const address = `Rua Conselheiro Nabuco, 210, Recife PE`
	const mapBox = new MapBox(address)
	await mapBox.getCoordinates()
	
	if (mapBox.lon === undefined) return { statusCode: 402, body: `location not found...` }
	else return {
			statusCode: 200,
			body: JSON.stringify({ lat: mapBox.lat, lon: mapBox.lon })
		}
}