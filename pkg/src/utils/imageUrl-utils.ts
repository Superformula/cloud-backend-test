import axios from 'axios'

/**
 * the idea behind this function is to validate the user's image url
 * @example
 * // throws an error
 * getImageUrl(``)
 * @example
 * // will return the given url, since it's apparently a valid one
 * getImageUrl(`https://avatars.githubusercontent.com/u/1250951?v=4`)
 * @example
 * // will assume that is a randomized image, and will create a unplash photo link
 * getImageUrl(`1621005281827-8df4fea4114b;MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjIxMTY5ODAw`)
 * @param imageUrl the user's image url
 * @returns the correct url for rendering the user's avatar
 */
export const getImageUrl = (imageUrl: string | null): string => {
	const invalidUrlError = new Error(`invalid image information`)
	if (!imageUrl) throw invalidUrlError
	else {
		if (imageUrl.startsWith(`http`)) return imageUrl

		const parts = imageUrl.split(`;`)
		if (parts.length === 2) { return `https://images.unsplash.com/photo-${parts[0]}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=${parts[1]}&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400` }
		throw invalidUrlError
	}
}
/**
 * gets a new imageUrl when the payload does not provide one
 * @async
 * @returns a new avatar url fetched from the unsplash api
 */
export const getRandomImageUrl = async (): Promise<string | undefined> => {
	try {
		const url = `https://source.unsplash.com/400x400/?face,person`
		const data = await axios.get(url)

		return getImageUrl(data.request.res.responseUrl)
	} catch (error) {
		return undefined
	}
}
