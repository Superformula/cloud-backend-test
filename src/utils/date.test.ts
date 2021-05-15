import { randomDob, randomCreatedAt, randomUpdatedAt } from './date.utils'

describe(`Testing random date of birth values`, () => {
	it(`Age MUST be within 21 to 35`, () => {
		const value = randomDob()

		expect(value).toBe(``)
	})
})

describe(`Testing random created at value`, () => {
	it(`The new date MUST be within this last year (days offset between 0 and 365)`, () => {
		const value = randomCreatedAt()

		expect(value).toBe(``)
	})
})

describe(`Testing random updatedAt value`, () => {
	it(`With a null or invalid createdAt date, it must throw an error`, () => {
		expect(() => randomUpdatedAt(``)).toThrow(`for an user to be updated, it has to have been created first`)
	})

	it(`With a valid createdAt date, it must return a date between then and now`, () => {
		const updateDate = randomUpdatedAt(`2021-01-01`)

		expect(updateDate).toBe(``)
	})
})