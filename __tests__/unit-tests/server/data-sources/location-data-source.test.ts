import { AWSError, Lambda } from 'aws-sdk';
import {
	fetchLocationInfoFailedErrorMessage,
	LocationDataSource,
} from '../../../../src/server/data-sources/location-data-source';
import ErrorCodes from '../../../../src/server/enums/error-codes';
import { emptyLocationInputErrorMessage } from '../../../../src/fetch-location-lambda/fetch-location-handler';
import { InvocationRequest, InvocationResponse } from 'aws-sdk/clients/lambda';
import { mocked } from 'ts-jest/utils';

type LambdaInvokeType = (
	_params: InvocationRequest,
	callback: (error: AWSError | null, data: InvocationResponse) => void,
) => void;

// Mocking Lambda and its method "invoke"
jest.mock('aws-sdk', () => {
	return {
		Lambda: jest.fn(() => ({
			invoke: jest.fn(),
		})),
	};
});

describe('server > data-sources > LocationDataSource tests', () => {
	test('Simple input (e.g. "Brasília") passed to fetchLocationInfo should return 5 locations', async () => {
		// ----- Arrange -----

		const mockLambda = new Lambda();
		mocked(mockLambda.invoke as LambdaInvokeType).mockImplementation(
			(_params: InvocationRequest, callback: (error: AWSError | null, data: InvocationResponse) => void) => {
				callback(null, {
					StatusCode: 200,
					Payload:
						'{"locations":[{"name":"Brasília, Federal District, Brazil","coordinates":[-47.8823,-15.7934]},{"name":"Brasília, Cascavel - Paraná, Brazil","coordinates":[-53.42,-24.94]},{"name":"Brasília, Feira De Santana - Bahia, Brazil","coordinates":[-38.9506,-12.2666]},{"name":"Brasília, Arapiraca - Alagoas, Brazil","coordinates":[-36.65,-9.75]},{"name":"Brasília Shopping, SCN Qd. 5 Bl. A, Brasília, Federal District 70307, Brazil","coordinates":[-47.889108,-15.786831]}]}',
				});
			},
		);
		const locationDataSource = new LocationDataSource(mockLambda);

		// ----- Act -----

		const output = await locationDataSource.fetchLocationInfo('Brasília');

		// ----- Assert -----

		expect(output.locations).toBeDefined();
		expect(output.locations.length).toEqual(5);
		for (const location of output.locations) {
			expect(location.name).toBeDefined();
			expect(location.coordinates.length).toEqual(2);
		}
	});

	test('Odd input (e.g. "asldkjfhasdlfkjh") passed to fetchLocationInfo should return 0 locations', async () => {
		// ----- Arrange -----

		const mockLambda = new Lambda();
		const mockInvoke = mocked(mockLambda.invoke as LambdaInvokeType);
		mockInvoke.mockImplementation(
			(_params: InvocationRequest, callback: (error: AWSError | null, data: InvocationResponse) => void) => {
				callback(null, {
					StatusCode: 200,
					Payload: '{"locations":[]}',
				});
			},
		);
		const locationDataSource = new LocationDataSource(mockLambda);

		// ----- Act -----

		const output = await locationDataSource.fetchLocationInfo('asldkjfhasdlfkjh');

		// ----- Assert -----

		expect(output.locations).toBeDefined();
		expect(output.locations.length).toEqual(0);
	});

	test('Empty input passed to fetchLocationInfo should return error', async () => {
		// ----- Arrange -----

		const mockLambda = new Lambda();
		mocked(mockLambda.invoke as LambdaInvokeType).mockImplementation(
			(_params: InvocationRequest, callback: (error: AWSError | null, data: InvocationResponse) => void) => {
				callback(null, {
					StatusCode: 200,
					FunctionError: 'Unhandled',
					Payload: `{"errorMessage":"${emptyLocationInputErrorMessage}"}`,
				});
			},
		);
		const locationDataSource = new LocationDataSource(mockLambda);

		// ----- Act & Assert -----

		try {
			expect.assertions(3);

			// Call fetchLocationInfo with an empty input and check if an Apollo error was thrown, then the details about the exception
			await locationDataSource.fetchLocationInfo('');
		} catch (error) {
			expect(error.message).toMatch(fetchLocationInfoFailedErrorMessage);
			expect(error.extensions?.code).toMatch(ErrorCodes.FETCH_LOCATION_INFO_FAILED);
			expect(error.extensions?.errorMessage).toMatch(emptyLocationInputErrorMessage);
		}
	});

	test('When Lambda.invoke fails, fetchLocationInfo should throw exception', async () => {
		// ----- Arrange -----

		const errorCode = 'FORBIDDEN';
		const errorMessage = 'You do not have permission to perform this action';
		const mockLambda = new Lambda();
		mocked(mockLambda.invoke as LambdaInvokeType).mockImplementation(
			(_params: InvocationRequest, callback: (error: AWSError | null, data: InvocationResponse) => void) => {
				callback({ code: errorCode, message: errorMessage, name: 'Forbidden', time: new Date() }, {});
			},
		);
		const locationDataSource = new LocationDataSource(mockLambda);

		// ----- Act & Assert -----

		try {
			expect.assertions(2);

			await locationDataSource.fetchLocationInfo('Dummy location');
		} catch (error) {
			expect(error.code).toMatch(errorCode);
			expect(error.extensions?.message).toMatch(errorMessage);
		}
	});
});
