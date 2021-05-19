import validatePut from '../crud-schema'

describe(`A put operation to the database`, () => {
	it(`having an empty object`, () => expect(() => validatePut(`{}`)).toThrowError())
	it(`having an empty payload`, () => expect(() => validatePut(``)).toThrowError())
	it(`having an empty name`, () => expect(() => validatePut(`{ "id": "123" }`)).toThrowError())
	it(`having an invalid date`, () => expect(() => validatePut(`{ "name": "Clericuzzi", "dob": "15/04/2021" }`)).toThrowError())
	it(`having an valid input`, () => {
		const payload = JSON.stringify({ address: `Rua Conselheiro Nabuco`, name: `Pedro Clericuzzi` })
		const value = validatePut(payload)

		expect(value).toBeTruthy()
	})
})
