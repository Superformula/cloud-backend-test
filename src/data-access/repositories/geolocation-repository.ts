import { GeolocationData, Maybe } from '../../graphql/types/schema-types';
import { GeocodeResponse, GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';
import { ApolloError } from 'apollo-server-errors';

export interface GeolocationRepository {
	getGeolocation(query: string): Promise<Maybe<GeolocationData>>;
}

export class MapboxGeolocationRepository implements GeolocationRepository {
	constructor(private client: GeocodeService) {}

	async getGeolocation(query: string): Promise<Maybe<GeolocationData>> {
		const request = this.client.forwardGeocode({
			query,
			mode: 'mapbox.places',
			limit: 1,
		});

		const response = await request.send();
		if (response.statusCode != 200) {
			throw new ApolloError('Error while fetching geolocation data', 'GeolocationApiRequestFailed', {
				respoonseCode: response.statusCode,
				respoonseBody: response.body,
			});
		}

		const responseBody = response.body as GeocodeResponse;
		if (responseBody.features.length === 0) {
			return null;
		}

		return {
			longitude: responseBody.features[0].center[0],
			latitude: responseBody.features[0].center[1],
		};
	}
}
