import { randomDob, formatJSDate, randomCreatedAt } from '../date-utils'

const oneDay = 86400000

describe(`Testing javascript date formatting to 'YYYY-MM-DD'`, () => {
	it(`Formatting an INVALID javascript Date object`, () => {
		const newDate = new Date(`invalid date`)
		expect(() => formatJSDate(newDate)).toThrowError(`invalid date provided`)
	})
	it(`Formatting a VALID javascript Date object`, () => {
		const newDate = new Date()
		const formattedDate = formatJSDate(newDate)

		const parts = formattedDate.split(`-`)
		expect(parts.length).toBe(3)
		expect(parts[0].length).toBe(4)
		expect(parts[1].length).toBe(2)
		expect(parts[2].length).toBe(2)
		expect(formattedDate.length).toBe(10)
	})
})

describe(`Testing random date of birth values`, () => {
	it(`Age MUST be within 21 to 35`, () => {
		const value = randomDob()
		const now = new Date()

		const dateParts = value.split(`-`)
		const dateValue = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))

		const diff = Math.abs(now.getTime() - dateValue.getTime())
		const diffYears = Math.ceil(diff / (oneDay * 365))

		expect(diffYears).toBeLessThanOrEqual(35)
		expect(diffYears).toBeGreaterThanOrEqual(21)
	})
})

describe(`Testing random created at value`, () => {
	it(`The new date MUST be within this last year (days offset between 0 and 365)`, () => {
		const now = new Date()
		const value = randomCreatedAt()
		const dateParts = value.split(`-`)
		const dateValue = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))

		const millisecondsBetween = (now.valueOf() - dateValue.valueOf())
		const daysBetween = Math.floor(millisecondsBetween / oneDay)

		expect(daysBetween).toBeLessThanOrEqual(365)
		expect(daysBetween).toBeGreaterThanOrEqual(0)
	})
})
