import { randomItem } from './array.utils'

describe(`Trying to fetch a random item from a given array`, () => {
	it(`When we provide an invalid array`, () => expect(() => randomItem(null)).toThrow(`invalid array provided`))
	it(`When we provide an empty array, it must return null`, () => expect(randomItem([])).toBeNull())
	it(`When we provide a valid array, it must one of it's items`, () =>
	{
		const item: number = randomItem([1, 2, 3])
		expect([1, 2, 3].includes(item)).toBeTruthy()
	})
})