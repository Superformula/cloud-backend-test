import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * this class encapsulates a lambda request
 * it will handle the input validation
 */
export default class LambdaRequest
{
	/**
	 * validates an incoming labda request
	 * @param e the lambda's request object
	 * @param schema the payload's schema (if none is provided we'll assume tha it is a GET or a DELETE and return a Record<string, unknown>)
	 */
	static validate(e: APIGatewayProxyEvent, schema: any = null): Record<string, string | unknown>
	{
		const request = new LambdaRequest(e, schema)

		return request.validate()
	}

	event: APIGatewayProxyEvent
	schema: any
	payload: any

	/**
	 * validates the request's payload and returns it to the user
	 * @param e the request's event
	 * @param schema the Joi schema to validate the request input, unless it is a GET OR DELETE
	 */
	constructor(e: APIGatewayProxyEvent, schema: any)
	{
		this.event = e
		this.schema = schema
	}

	/**
	 * gets the values passed to the backend via query string params
	 * @returns an object that encapsulates all of its properties (but all are going to be STRINGS)
	 */
	getQueryParams(): Record<string, string>
	{
		return {}
	}

	/**
	 * here we'll assume only a payload of application/json
	 * se, we'll parse the body and validate it agaist the given schema
	 * @returns an object, IF VALIDATED, that represents the json string provided in the payload
	 */
	getPayloadFromJsonString(): Record<string, unknown>
	{
		return {}
	}

	/**
	 * validates an incoming labda request
	 * @param e the lambda's request object
	 * @param schema the payload's schema (if none is provided we'll assume tha it is a GET or a DELETE and return a Record<string, unknstringown>)
	 */
	validate(): Record<string, string | unknown>
	{
		const queryParams = {}
		if (queryParams) return this.getQueryParams()
		else return this.getPayloadFromJsonString()
	}
}