import { GeolocationData } from '../../graphql/types/schema-types';
import { MapboxGeolocationRepository } from './geolocation-repository';
import Geocoding, { sendFn } from './__mocks__/@mapbox/mapbox-sdk/services/geocoding';

describe('Test get geolocation function', () => {
	const mockGeolocationData: GeolocationData = {
		latitude: 123,
		longitude: 456,
	};

	const setup = () => {
		const geocodingClient = Geocoding();
		return {
			repository: new MapboxGeolocationRepository(geocodingClient),
			client: geocodingClient,
		};
	};

	it('Should get geolocation with valid query', async () => {
		const { repository, client } = setup();

		const query = 'Test';
		sendFn.mockReturnValueOnce({
			statusCode: 200,
			body: {
				features: [
					{
						center: [mockGeolocationData.longitude, mockGeolocationData.latitude],
					},
				],
			},
		});

		const geolocation = await repository.getGeolocation(query);
		expect(geolocation).toEqual(mockGeolocationData);
		expect(client.forwardGeocode).toHaveBeenCalledWith({
			query,
			mode: 'mapbox.places',
			limit: 1,
		});
	});

	it('Should return null if no location was found', async () => {
		const { repository } = setup();

		const query = 'Test';
		sendFn.mockReturnValueOnce({
			statusCode: 200,
			body: {
				features: [],
			},
		});

		const geolocation = await repository.getGeolocation(query);
		expect(geolocation).toBeNull();
	});

	it('Should throw error on bad response code from mapbox', async () => {
		const { repository } = setup();

		const query = 'Test';
		sendFn.mockReturnValueOnce({
			statusCode: 500,
		});

		try {
			await repository.getGeolocation(query);
			fail();
		} catch (error) {
			expect(error.message).toBe('Error while fetching geolocation data');
		}
	});
});
