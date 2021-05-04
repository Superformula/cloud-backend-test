import { accessTokenEnvName, configureMapbox } from '../../configuration/mapbox';
import { GeolocationData } from '../../graphql/types/schema-types';
import { MapboxGeolocationRepository } from './geolocation-repository';
import { sendFn } from './__mocks__/@mapbox/mapbox-sdk/services/geocoding';

describe('Test get geolocation function', () => {
	const mockGeolocationData: GeolocationData = {
		latitude: 123,
		longitude: 456,
	};

	const setup = () => {
		process.env[accessTokenEnvName] = 'test-access-key';
		return new MapboxGeolocationRepository(configureMapbox());
	};

	it('Should get geolocation with valid query', async () => {
		const repo = setup();

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

		const geolocation = await repo.getGeolocation(query);
		expect(geolocation).toEqual(mockGeolocationData);
		expect(repo['client'].forwardGeocode).toHaveBeenCalledWith({
			query,
			mode: 'mapbox.places',
			limit: 1,
		});
	});

	it('Should return null if no location was found', async () => {
		const repo = setup();

		const query = 'Test';
		sendFn.mockReturnValueOnce({
			statusCode: 200,
			body: {
				features: [],
			},
		});

		const geolocation = await repo.getGeolocation(query);
		expect(geolocation).toBeNull();
	});

	it('Should throw error on bad response code from mapbox', async () => {
		const repo = setup();

		const query = 'Test';
		sendFn.mockReturnValueOnce({
			statusCode: 500,
		});

		try {
			await repo.getGeolocation(query);
			fail();
		} catch (error) {
			expect(error.message).toBe('Error while fetching geolocation data');
		}
	});
});
