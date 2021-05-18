import cityGenerator, { addressList } from './cities.list'

test(`Valid city`, () =>
{
	const city = cityGenerator()
	const validCity = addressList.includes(city)

	expect(validCity).toBe(true)
})