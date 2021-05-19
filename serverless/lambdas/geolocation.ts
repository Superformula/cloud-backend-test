// at least for now
/* eslint-disable */
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult
} from 'aws-lambda'

import MapBox from '@devclericuzzi/cloud-backend-lib/geolocation/mapbox/mapbox.geo'
import LambdaResponse from '@devclericuzzi/cloud-backend-lib/types/lambdaResponse'
import { validateAddress } from '@devclericuzzi/cloud-backend-lib/validation/schemas/geocode.schema'

/**
 * handles ANY calls to this endpoint
 * @param event the request payload
 * @returns the processed response
 */
const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
{
	try
	{
		if (!event.body) return new LambdaResponse(`invalid payload`, 400)

		const address: string = validateAddress(event.body)
		const location = new MapBox(address)
		await location.getCoordinates()

		return new LambdaResponse({ lat: location.lat, lon: location.lon }, 200)
	}
	catch (error) {
		return {
			body: error.message || `Unknown error...`,
			statusCode: error.statusCode || 500
		}
	}
}

export default handler