import { gql, makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';
import UserTypeDefs from './user/type-defs';
import UserResolvers from './user/resolvers';

// These type definitions are meant to expose everything that is not specific to some entity, and also
// to define types that will be extended by these specific entities (e.g. Query and Mutation)
const rootTypeDefs = gql`
	"""
	Query is meant to expose all the APIs whose purpose is to simply fetch data
	"""
	type Query {
		hello: String! # since it's not possible to have empty definitions, we are keeping this dummy query
	}

	"""
	Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data
	"""
	type Mutation {
		ping: String! # since it's not possible to have empty definitions, we are keeping this dummy mutation
	}
`;

// Resolvers for common fields and types
const rootResolvers = {
	Query: {
		hello: (): string => 'Hello world!', // dummy
	},
	Mutation: {
		ping: (): string => 'Pong', // dummy
	},
};

// Merge all the type definitions and resolvers, and export the schema, to be used by Apollo Server
export default makeExecutableSchema({
	typeDefs: [rootTypeDefs, UserTypeDefs],
	resolvers: merge(rootResolvers, UserResolvers),
});
