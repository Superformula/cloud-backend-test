const { geolocationPost } = require(`@devclericuzzi/cloud-backend-test/dist/lambdas/functions/geolocation.post`)

/**
 * handles a post request
 */
module.exports.handler = async (event, context, callback) =>
{
	const value = await geolocationPost(event, callback)
	return value
}