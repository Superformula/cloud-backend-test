/**
 * gets a random item from within the given array
 * @param {Array<T>} arr an array of items
 * @returns {T} an item inside the given array
 */
export function randomItem<T>(arr: Array<T>): T
{
	if (!arr || !Array.isArray(arr)) throw new Error(`invalid array provided`)
	if (arr.length === 0) return null
	else return arr[Math.floor(Math.random() * arr.length)]
} 