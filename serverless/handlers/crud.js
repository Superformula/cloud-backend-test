const { crudPutPost } = require(`@devclericuzzi/cloud-backend-test/dist/lambdas/functions/crud.put-post`)

/**
 * handles a post request
 */
module.exports.handler = async (e, context, callback) =>
{
	const value = await crudPutPost(e, callback)
	return value
}
