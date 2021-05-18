import joi from 'joi'
import { validate } from '../joi/joi.validation'

/**
 * validates the request's payload, checkin if it conforms to { address: joi.string().required() }
 * @param body the request's payload
 * @returns the request's payload address field, IF validated
 */
export const validateCreate = (body: string): Record<string, string> =>
{
	if (!body) throw new Error(`invalid payload`)
	const schema = {
		dob: joi.date().required(),
		name: joi.string().required(),
		address: joi.string().allow(null),
		imageUrl: joi.string().allow(null),
		description: joi.string().allow(null)
	}
	const payload: {
		dob: string,
		name: string,
		address: string,
		imageUrl: string,
		description: string
	} = validate(schema, body)

	return payload
}