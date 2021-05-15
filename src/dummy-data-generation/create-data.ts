import UserModel from '../models/user.model'

/**
 * creates a list oj json inputs for testing purposes
 * @param amount the number of items to be generated 
 * @returns a list of randomly generated users
 */
const createJSON = (amount: number): string =>
{
	if (amount < 1) return ``

	const items: string[] = []
	while (items.length < amount) items.push(createItem())

	return items.join(`,`)
}
/**
 * creates a single user model and returns it's required data as a json
 * @returns a json string containing the newly created user model
 */
const createItem = (): string =>
{
	const model = new UserModel()
	model.generateRandomValues()

	return JSON.stringify(model)
}

export default { createJSON, createItem }