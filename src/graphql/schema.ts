import { makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
import { mainTypeDefs } from './main/main-type-defs';
import { mainResolvers } from './main/main-resolvers';
import { userTypeDefs } from './user/user-type-defs';
import { userResolvers } from './user/user-resolvers';

// Merge all the type definitions and resolvers, and export the schema, to be used by Apollo Server
export const schema = makeExecutableSchema({
	typeDefs: [mainTypeDefs, userTypeDefs],
	resolvers: merge(mainResolvers, userResolvers),
});

export default schema;
