import { UserModelConverter } from '../model-converters/user-model-converter';
import { Config } from 'apollo-server-core';
import { schema } from '../graphql/schema';
import { UserRepo } from '../repositories/user-repo';

export const apolloServerConfig: Config = {
	schema,
	dataSources: () => ({
		userRepo: new UserRepo(),
	}),
	context: { userModelConverter: new UserModelConverter() },
};
