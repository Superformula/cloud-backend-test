import randomItem from '../array-utils'

describe(`Trying to fetch a random item from a given array`, () => {
	it(`When we provide an invalid or empty array`, () => expect(() => randomItem([])).toThrow(`invalid array provided`))
	it(`When we provide a valid array, it must one of it's items`, () => {
		const item: number = randomItem([1, 2, 3])
		expect([1, 2, 3].includes(item)).toBeTruthy()
	})
})
