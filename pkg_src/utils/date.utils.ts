/**
 * format a given date object into a 'YYYY-MM-DD' string
 * @param date a valid typescript Date object
 * @returns a 'YYYY-MM-DD' formatted date
 */
export const formatJSDate = (date: Date): string =>
{
	if (isNaN(date.getDate())) throw new Error(`invalid date provided`)

	return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
}

/**
 * creates a new date of birth
 * by definition this can only create dates that will
 * give the user an age of 21 to 35 years
 * @returns {string} a new date of birth for a newly created user
 */
export const randomDob = (): string =>
{
	const daysLimitLower = 365 * 21
	const daysLimitUpper = 365 * 35
	const days = Math.floor(Math.random() * (daysLimitUpper - daysLimitLower)) + daysLimitLower
	const date: Date = new Date()
	date.setDate(date.getDate() - days)
	
	return formatJSDate(date)
}

/**
 * creates a random date for the user's creation
 * by definition this can only create a date within this year
 * @returns {string} a new date of birth for a newly created user
 */
export const randomCreatedAt = (): string =>
{
	const daysLimitLower = 365
	const daysLimitUpper = 0
	const days = Math.floor(Math.random() * (daysLimitUpper - daysLimitLower)) + daysLimitLower
	const date: Date = new Date()
	date.setDate(date.getDate() - days)

	return formatJSDate(date)
}