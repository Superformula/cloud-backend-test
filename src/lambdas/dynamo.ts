// at least for now
/* eslint-disable */
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult
} from 'aws-lambda'

/**
 * handles ANY calls to this endpoint
 * @param event the request payload
 * @returns the processed response
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
{
	const queries = JSON.stringify(event.queryStringParameters)

	return {
		statusCode: 200,
		body: `Queries: ${queries}`
	}
}