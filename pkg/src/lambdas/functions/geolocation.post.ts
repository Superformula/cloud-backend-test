/* eslint-disable */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import LambdaRequest from '../types/lamdaRequest'
// import LambdaResponse from '../types/lambdaResponse'

import geocodeSchema from '../schemas/geocode-schema'
import MapBox from '../../geolocation/mapbox/mapbox.geo'

/**
 * fetchs lat and long coordinates by checking the given address
 * with the given provider
 * @param e the lambda's request object
 */
export const geolocationPost = async (e: APIGatewayProxyEvent, result: APIGatewayProxyResult) =>
{
	try
	{
		const payload = LambdaRequest.validate(e, geocodeSchema)
		const mapBox = new MapBox(payload[`address`] as string)
		await mapBox.getCoordinates()
		
		if (mapBox.lon === undefined) return { statusCode: 402, body: `location not found...` }
		else return {
			statusCode: 200,
			body: JSON.stringify({ lat: mapBox.lat, lon: mapBox.lon })
		}
	}
	catch(error)
	{
		result.body = JSON.stringify({ message: `You might check your spelling` })
		result.statusCode = 500
		return result
	}
}