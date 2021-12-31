import fetch from 'node-fetch'

/*
Return the coordinates of a given address using the MapBox Places API

eg. a query with location = 'Central Park'
returns {
  name: 'Central Park, New York, New York, United States',
  coordinates: [ -73.98, 40.77	],
}

Environment Variables:
  * MAPBOX_API_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places' (default)
  * MAPBOX_API_TOKEN    = 'pk.token-goes-here'
*/

export const handler = async (event: any = {}): Promise<any> => {
  let queryLocation = event.pathParameters?.location
  if (!queryLocation) {
    return { statusCode: 400, body: `Error: You are missing the path parameter location`}
  }

  let response : any = {}

  try {
    response = await fetch(`${process.env.MAPBOX_API_BASE_URL}/${encodeURIComponent(queryLocation)}.json?access_token=${process.env.MAPBOX_API_TOKEN}&limit=1`)
  } catch (error) {
    console.log(JSON.stringify(error))
    return { statusCode: 500, body: `Unable to get location at this time`}
  }
  const json = await response.json()

  if (json.features && json.features.length > 0) {
    response = {
      statusCode: 200,
      name: json.features[0].place_name,
      coordinates: json.features[0].center
    }
  }
  else {
    response = { statusCode: 404, body: `Sorry, the address '${queryLocation}' was not found` }
  }

  return response
}