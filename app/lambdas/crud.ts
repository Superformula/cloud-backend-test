// at least for now
/* eslint-disable */
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult
} from 'aws-lambda'

import LambdaResponse from '@devclericuzzi/cloud-backend-lib/types/lambdaResponse'

/**
 * handles ANY calls to this endpoint
 * @param event the request payload
 * @async
 * @returns the processed response
 */
const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
{
	try
	{
		if (event.httpMethod === `PUT` || event.httpMethod === `POST`)
			return await putAction(event.body)
		else 
			return new LambdaResponse(`HTTP_METHOD rejected (${event.httpMethod})`, 405)
	}
	catch(error)
	{
		return {
			statusCode: 500,
			body: error.message || `Unknown error...`
		}
	}
}

/**
 * handles a put request, with the following steps
 * 1) loads the current item, o identify if the NAME has changed
 * 2) if the name HAS changed, we must delete all instances of it, otherwise we move on
 * 3) we do a batch write with it's new values
 * @param payload the request's payload
 * @async
 * @returns a lambda response 
 */
const putAction = async (payload: string | null): Promise<LambdaResponse> =>
{
	if (!payload) return new LambdaResponse(`Invalid payload`, 400)
	

	return new LambdaResponse(`falha ao criar a desgraça`, 500)
}

export default handler