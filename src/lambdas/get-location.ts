import fetch from 'node-fetch'

/*
Return the coordinates of a given address using the MapBox Places API

eg. address = '1600 Pennsylvania Ave NW, Washington, DC' or 'Central Park'
result = { coordinates: [ -76.982011, 38.879239 ] }

Environment Variables:
  * MAPBOX_API_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places' (default)
  * MAPBOX_API_TOKEN    = 'pk.token-goes-here'
*/

export const handler = async (event: any = {}): Promise<any> => {
  let queryAddress = event.arguments.address
  if (!queryAddress) {
    return {
      error: {
        message: 'You are missing the address argument',
        type: 'ValidationError',
      },
    }
  }

  let response: any = {}

  let url = `${process.env.MAPBOX_API_BASE_URL}/${encodeURIComponent(queryAddress)}.json`
  url = `${url}?access_token=${process.env.MAPBOX_API_TOKEN}&limit=1`

  try {
    response = await fetch(url)
  } catch (error) {
    return {
      error: {
        message: `Unable to get location at this time`,
        type: 'ValidationError',
      },
    }
  }
  const json = await response.json()

  if (json.features && json.features.length > 0) {
    response = {
      coordinates: json.features[0].center,
    }
  } else {
    response = {
      error: {
        message: `Sorry, the address '${queryAddress}' was not found. ${JSON.stringify(json)}`,
        type: 'NotFoundError',
      },
    }
  }

  return response
}
