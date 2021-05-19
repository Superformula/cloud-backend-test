const Joi = require(`joi`)

/**
 * validates a given payload against a provided joi schema
 * @param schema a joi schema definition
 * @param payload the request's payload
 * @returns if the schema is not validated, we'll throw an error,
 * otherwise the given payload will be returned
 */
// eslint-disable-next-line
export default <T>(schema: any, body: string): T => {
	try {
		const { error, value } = Joi.object(schema).validate(JSON.parse(body))
		if (error) throw error
		return value
	} catch (error) {
		if (error.message.includes(`Unexpected token`)) throw new Error(`invalid payload ('${body}')`)
		throw new Error(error.message || `Unknown error`)
	}
}
