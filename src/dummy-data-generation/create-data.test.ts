import createData from './create-data'

describe(`When creating a single item`, () => {
	it(`We must have all required attributes filled`, () => {
		const dummyData = createData.createItem()
		const parsedData = JSON.parse(dummyData)

		const allFieldsFilled: boolean = parsedData.id && parsedData.dob && parsedData.name && parsedData.address && parsedData.createdAt
		expect(allFieldsFilled).toBeTruthy()
	})
})

describe(`When creating a list of items`, () => {
	it(`We must have and positive integer as the amount of requested items`, () => {
		expect(createData.createJSON(0)).toBe(``)
		expect(createData.createJSON(-1)).toBe(``)
		expect(createData.createJSON(-10)).toBe(``)
	})

	it(`We must have the exact amount that was requested`, () => {
		const dummyData = createData.createJSON(2)
		const itemCount: Record<string, unknown>[] = JSON.parse(`[ ${dummyData} ]`).length

		expect(itemCount).toBe(2)
	})
})