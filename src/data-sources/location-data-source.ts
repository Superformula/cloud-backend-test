import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import AWS from 'aws-sdk';
import { ErrorCodes } from '../enums/error-codes';
import { LocationQueryInput, LocationQueryOutput } from '../lambdas/fetch-location/dist/types';

export class LocationDataSource extends DataSource {
	lambda: AWS.Lambda;
	functionName = 'fetch_location'; // TODO: put this in an env. variable, so that this class and terraform can use it from the same place

	constructor() {
		super();
		this.lambda = new AWS.Lambda();
	}

	async fetchLocationInfo(input: string): Promise<LocationQueryOutput> {
		const locationQueryInput: LocationQueryInput = {
			value: input,
		};

		let result: LocationQueryOutput;

		try {
			const lambdaResponse = await this.lambda
				.invoke({
					FunctionName: this.functionName,
					Payload: JSON.stringify(locationQueryInput),
				})
				.promise();

			// Casting Payload to string since we know that the result will come serialized as string from FetchLocationLambda.
			// If something unexpected happens, we are going to catch the exception anyways.
			result = JSON.parse(lambdaResponse.Payload as string);
		} catch (err) {
			throw new ApolloError(
				'An error occurred while trying to fetch location information from MapBox API.',
				ErrorCodes.FETCH_LOCATION_INFO_FAILED,
				err,
			);
		}

		return result;
	}
}

export default LocationDataSource;
