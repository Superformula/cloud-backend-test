import joi from 'joi'
import { validate } from '../joi/joi.validation'

/**
 * validates the request's payload, checking if it conforms to { address: joi.string().required() }
 * @param body the request's payload
 * @returns the request's payload address field, IF validated
 */
export const validateAddress = (body: string): string =>
{
	if (!body) throw new Error(`invalid payload`)
	const payload: { address: string } = validate({ address: joi.string().required() }, body)
	
	return payload.address
}