import { UserModelConverter } from '../model-converters/user-model-converter';
import { Config } from 'apollo-server-core';
import { schema } from '../graphql/schema';
import { UserDataSource } from '../data-sources/user-data-source';

export const apolloServerConfig: Config = {
	schema,
	dataSources: () => ({
		userDataSource: new UserDataSource(),
	}),
	context: { userModelConverter: new UserModelConverter() },
};
