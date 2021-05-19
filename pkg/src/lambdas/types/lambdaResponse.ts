/**
 * defines the default lambda response structure
 */
export default class LambdaResponse {
	body: string
	statusCode: number

	/**
	 * default constructor
	 * @param body the value to be returned to the requester
	 * @param statusCode the http response code
	 */
	constructor(body: unknown, statusCode: number) {
		this.body = JSON.stringify(body)
		this.statusCode = statusCode
	}
}
