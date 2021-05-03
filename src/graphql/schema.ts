import { makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
import { mainTypeDefs } from './main/main-type-defs';
import { mainResolvers } from './main/main-resolvers';
import { userTypeDefs } from './user/user-type-defs';
import { userResolvers } from './user/user-resolvers';
import { locationTypeDefs } from './location/location-type-defs';
import { locationResolvers } from './location/location-resolvers';

// Merge all the type definitions and resolvers, and export the schema, to be used by Apollo Server
export const schema = makeExecutableSchema({
	typeDefs: [mainTypeDefs, userTypeDefs, locationTypeDefs],
	resolvers: merge(mainResolvers, userResolvers, locationResolvers),
});

export default schema;
