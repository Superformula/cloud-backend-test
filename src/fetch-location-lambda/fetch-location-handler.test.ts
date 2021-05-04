import axios from 'axios';
import { handler, emptyLocationInputErrorMessage, invalidResponseObjectErrorMessage } from './fetch-location-handler';

describe('fetch-location-lambda > handler', () => {
	test('If a simple valid input is passed to the handler, it should return an object with a property "locations", filled with the locations that best fit the given input', async () => {
		// ----- Arrange -----
		const mockResponse = {
			data: {
				features: [
					{ place_name: 'Brasília, Federal District, Brazil', center: [-47.8823, -15.7934] },
					{ place_name: 'Brasília, Cascavel - Paraná, Brazil', center: [-53.42, -24.94] },
					{ place_name: 'Brasília, Feira De Santana - Bahia, Brazil', center: [-38.9506, -12.2666] },
					{ place_name: 'Brasília, Arapiraca - Alagoas, Brazil', center: [-36.65, -9.75] },
					{
						place_name: 'Brasília Shopping, SCN Qd. 5 Bl. A, Brasília, Federal District 70307, Brazil',
						center: [-47.889108, -15.786831],
					},
				],
			},
		};

		// when someone calls axios.get, return mockResponse
		jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

		// ----- Act -----
		const output = await handler({ value: 'Brasília' });

		// ----- Assert -----
		expect(output.locations).toBeDefined();
		expect(output.locations.length).toEqual(5);
		for (let i = 0; i < output.locations.length; i++) {
			expect(output.locations[i].name).toMatch(mockResponse.data.features[i].place_name);
			expect(output.locations[i].coordinates).toEqual(mockResponse.data.features[i].center);
		}
	});

	test('If an empty input is passed to the handler, it should return an error indicating it', () => {
		// ----- Arrange -----
		// (nothing to arrange)

		// ----- Act & Assert -----
		expect(handler({ value: undefined as any })).rejects.toThrow(emptyLocationInputErrorMessage);
	});

	test('If some error occurs while fetching data from Mapbox API, the handler should throw an exception indicating it', () => {
		// ----- Arrange -----
		const mockError = {
			response: {
				status: 401,
				data: { message: 'Not Authorized - No Token' },
			},
		};

		// when someone calls axios.get, return mockResponse
		jest.spyOn(axios, 'get').mockRejectedValue(mockError);

		// ----- Act & Assert -----
		expect(handler({ value: 'Brasília' })).rejects.toThrow(`${mockError.response.status}`); // the error message should contain the status code
	});

	test('If Mapbox API apparently returned a good response, but with missing fields, the handler should throw an exception indicating it', () => {
		// ----- Arrange -----
		const mockResponse = {};

		// when someone calls axios.get, throw mockError
		jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

		// ----- Act & Assert -----
		expect(handler({ value: 'Brasília' })).rejects.toThrow(invalidResponseObjectErrorMessage);
	});
});
