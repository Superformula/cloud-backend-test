import nameGenerator, { boyFirstNames, girlFirstnames, getBoyName, getGirlName } from './names.list'

test(`Getting a boy name`, () => {
	const name: string = getBoyName()
	const isBoyName: boolean = boyFirstNames.includes(name)

	expect(isBoyName).toBeTruthy()
})

test(`Getting a girl name`, () => {
	const name: string = getGirlName()
	const isGirlName: boolean = girlFirstnames.includes(name)

	expect(isGirlName).toBeTruthy()
})

test(`Getting a full name`, () => {
	const name: string = nameGenerator()

	expect(name).toBeTruthy()
})