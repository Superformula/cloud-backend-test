import { getImageUrl } from '../src/utils/imageUrl.utils'


/**
 * gets a new imageUrl when the payload does not provide one
 * @async
 * @returns a new avatar url fetched from the unsplash api
 */
export const getRandomImageUrl = async (): Promise<string | undefined> =>
{
	try
	{
		const data = await Promise.resolve({
			request: {
				res: {
					responseUrl: `https://images.unsplash.com/photo-1621219157709-552cea9a882e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjIxMjk5OTc3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`
				}
			}
		})
		
		return getImageUrl(data.request.res.responseUrl)
	}
	catch(error)
	{
		return undefined
	}
}