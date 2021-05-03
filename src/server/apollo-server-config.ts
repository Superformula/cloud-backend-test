import { UserModelConverter } from './model-converters/user-model-converter';
import { Config } from 'apollo-server-core';
import { schema } from './graphql/schema';
import { UserDataSource } from './data-sources/user-data-source';
import { LocationDataSource } from './data-sources/location-data-source';
import { LocationModelConverter } from './model-converters/location-model-converter';

export const apolloServerConfig: Config = {
	schema,
	dataSources: () => ({
		userDataSource: new UserDataSource(),
		locationDataSource: new LocationDataSource(),
	}),
	context: {
		userModelConverter: new UserModelConverter(),
		locationModelConverter: new LocationModelConverter(),
	},
};
