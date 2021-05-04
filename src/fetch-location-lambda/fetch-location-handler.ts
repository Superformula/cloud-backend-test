import axios, { AxiosResponse } from 'axios';
import { LocationQueryInput, LocationQueryOutput } from './types';

export const emptyLocationInputErrorMessage =
	'Received a null/undefined/empty location input. The location input must have a value.';

export const invalidResponseObjectErrorMessage =
	'Something wrong happened while fetching coordinates from Mapbox API. The response object is not valid.';

export async function handler(event: LocationQueryInput): Promise<LocationQueryOutput> {
	if (!event || !event.value) {
		throw new Error(emptyLocationInputErrorMessage);
	}

	// organize data to send to Mapbox API
	const mapboxGeocodingPlacesApiUrl =
		process.env.MAPBOX_GEOCODING_PLACES_API_URL || 'https://api.mapbox.com/geocoding/v5/mapbox.places';
	const encodedLocationInput = encodeURIComponent(event.value);
	const params = { access_token: process.env.MAPBOX_ACCESS_TOKEN };

	console.log('Fetching coordinates from Mapbox API for the given location input: ', event);

	let responseFromMapbox: AxiosResponse;

	// send GET to mapbox API, in order to get coordinates of the locations related to the given location input
	try {
		responseFromMapbox = await axios.get(`${mapboxGeocodingPlacesApiUrl}/${encodedLocationInput}.json`, { params });
	} catch (err) {
		throw new Error(
			`Failed to get coordinates from Mapbox API with code ${err.response.status}: ${err.response.data.message}`,
		);
	}

	// check if the response is valid
	if (!responseFromMapbox || !responseFromMapbox.data || !responseFromMapbox.data.features) {
		throw new Error(invalidResponseObjectErrorMessage);
	}

	const locQueryOutput: LocationQueryOutput = {
		locations: [],
	};

	// build the LocationQueryOutput from the response from mapbox API
	for (const feat of responseFromMapbox.data.features) {
		locQueryOutput.locations.push({
			name: feat.matching_place_name || feat.place_name, // prefer matching_place_name to place_name, since matching_place_name, if returned, gives a string that is in the same language as the given location input
			coordinates: feat.center,
		});
	}

	console.log(
		'Sucessfully fetched coordinates: ',
		locQueryOutput.locations.map((loc) => loc.coordinates),
	);

	return locQueryOutput;
}
