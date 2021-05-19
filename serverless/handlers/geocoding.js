const MapBox = require(`@devclericuzzi/cloud-backend-test/dist/geolocation/mapbox/mapbox.geo`).default

/**
 * handles a post request
 */
module.exports.handler = async (event, context, callback) =>
{
	const mapBox = new MapBox(JSON.parse(event.body).address)
	await mapBox.getCoordinates()

	callback(null, {
		statusCode: 200,
		body: JSON.stringify({ lat: mapBox.lat, lon: mapBox.lon })
	})
}