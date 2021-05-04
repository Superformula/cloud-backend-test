import { ApolloError } from 'apollo-server-lambda';

export const accessTokenEnvName = 'MAPBOX_ACCESS_TOKEN';

export interface MapboxConfiguration {
	accessToken: string;
}

export const configureMapbox = (): MapboxConfiguration => {
	const accessToken = process.env[accessTokenEnvName];

	if (!accessToken) {
		throw new ApolloError('No Mapbox access token provided');
	}

	return {
		accessToken: accessToken,
	};
};
