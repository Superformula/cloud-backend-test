import { validateAddress } from './geocode.schema'

describe(`The payload to the 'getCoordinates' endpoint should conform to { address: joi.string().required() }`, () =>
{
	it(`When an empty string is provided`, () => expect(() => validateAddress(``)).toThrowError(`invalid payload`))
	it(`When a single string is provided`, () => expect(() => validateAddress(`test string`)).toThrowError(`invalid payload`))
})