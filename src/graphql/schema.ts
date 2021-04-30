import { makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
import MainTypeDefs from './main/main-type-defs';
import MainResolvers from './main/main-resolvers';
import UserTypeDefs from './user/user-type-defs';
import UserResolvers from './user/user-resolvers';

// Merge all the type definitions and resolvers, and export the schema, to be used by Apollo Server
export default makeExecutableSchema({
	typeDefs: [MainTypeDefs, UserTypeDefs],
	resolvers: merge(MainResolvers, UserResolvers),
});
