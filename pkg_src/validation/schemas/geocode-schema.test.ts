import { validateAddress } from './geocode.schema'

describe(`The payload to the 'getCoordinates' endpoint should conform to { address: joi.string().required() }`, () =>
{
	it(`When an empty string is provided`, () => expect(() => validateAddress(``)).toThrowError(`invalid payload`))
	it(`When a single string is provided`, () => expect(() => validateAddress(`test string`)).toThrowError(`invalid payload`))

	it(`When a valid object is provided`, () =>
	{
		const payload: string = JSON.stringify({ address: `Recife, Pernambuco` })
		const isValid = validateAddress(payload)

		expect(isValid).toBeTruthy()
	})
	it(`When aaddress is null or empty`, () =>
	{
		const payload: string = JSON.stringify({ address: undefined })
		expect(() => validateAddress(payload)).toThrowError()
	})
	it(`When aaddress is not string`, () =>
	{
		const payload: string = JSON.stringify({ address: 37 })
		expect(() => validateAddress(payload)).toThrowError()
	})
	it(`When a valid object is provided, exept that it has more attributes`, () =>
	{
		const payload: string = JSON.stringify({ address: `Recife, Pernambuco`, age: 37 })
		expect(() => validateAddress(payload)).toThrowError()
	})
})