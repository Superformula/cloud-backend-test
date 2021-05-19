// import LambdaRequest from '../lamdaRequest'
// import { APIGatewayProxyEvent } from 'aws-lambda'

/**
 * creates a mocked version of a real lambda request
 * @returns a mocked APIGatewayProxyEvent
 */
// const eventMock = () => ({ body: ``, headers: null, httpMethod: null, isBase64Encoded: null, multiValueHeaders: null, multiValueQueryStringParameters: null, path: null, pathParameters: null, queryStringParameters: null, requestContext: null, resource: null, stageVariables: null })

describe(`When an endpoint is reached, we must evaluate the given payload`, () =>
{
	it (`when we receive query params, and schema`, () =>
	{
		// const schema = {} // it can be anything, as long as is not null
		// const event: APIGatewayProxyEvent = eventMock()

		// const request = new LambdaRequest(event, schema)
		expect(1).toBe(2)
	})
})