import validate from '../joi/joi-validation'
const Joi = require(`joi`)

/**
 * validates the request's payload, checkin if it conforms to { address: Joi.string().required() }
 * @param body the request's payload
 * @returns the request's payload address field, IF validated
 */
export default (body: string): Record<string, string> => {
	if (!body) throw new Error(`invalid payload`)
	const schema = {
		id: Joi.string().allow(null),
		dob: Joi.date().allow(null),
		name: Joi.string().required(),
		address: Joi.string().allow(null),
		imageUrl: Joi.string().allow(null),
		description: Joi.string().allow(null)
	}
	const payload: {
		id: string,
		dob: string,
		name: string,
		address: string,
		imageUrl: string,
		description: string
	} = validate(schema, body)

	return payload
}
