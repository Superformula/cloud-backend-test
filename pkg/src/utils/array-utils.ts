/**
 * gets a random item from within the given array
 * @param {Array<T>} arr an array of items
 * @returns {T} an item inside the given array
 */
export default <T>(arr: Array<T>): T =>
{
	if (!arr || !Array.isArray(arr) || arr.length === 0) throw new Error(`invalid array provided`)
	else if (arr.length === 1) return arr[0]!
	else return arr[Math.floor(Math.random() * arr.length)]!
}