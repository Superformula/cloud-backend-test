/**
 * creates a new date of birth
 * by definition this can only create dates that will
 * give the user an age of 21 to 35 years
 * @returns {string} a new date of birth for a newly created user
 */
export const randomDob = (): string =>
{
	const date: Date = new Date()
	console.log(`randomDob:`, date)
	return ``
}

/**
 * creates a random date for the user's creation
 * by definition this can only create a date within this year
 * @returns {string} a new date of birth for a newly created user
 */
export const randomCreatedAt = (): string =>
{
	return ``
}

/**
 * creates a random  update date
 * this new date can only be between the given createdAt date and now
 * @param {string} createdAt the user's creation date
 * @returns {string} a new date of birth for a newly created user
 */
export const randomUpdatedAt = (createdAt: string): string =>
{
	if (!createdAt) throw new Error(`for an user to be updated, it has to have been created first`)
	return ``
}