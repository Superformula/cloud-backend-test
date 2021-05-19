/* eslint-disable */
import AWS from 'aws-sdk'
import LambdaRequest from '../types/lamdaRequest'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import UserModel from '../../models/user.model'
import { putSchema, postSchema } from '../schemas/crud-schema'

/**
 * fetchs lat and long coordinates by checking the given address
 * with the given provider
 * @param e the lambda's request object
 */
export const crudPutPost = async (e: APIGatewayProxyEvent, result: APIGatewayProxyResult) =>
{
	try
	{
		const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

		const payload = LambdaRequest.validate(e, e.httpMethod === `POST` ? postSchema : putSchema)! as Record<string, string>
		const user = new UserModel(payload)
		
		if (e.httpMethod === `POST`)
			await user.createUser(dynamodb)
		else
			await user.updateUser(dynamodb)

		result.statusCode = 200
		return result
	}
	catch(error)
	{
		result.body = error.message || `Internal server error`
		result.statusCode = 500
		return result
	}
}