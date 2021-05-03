import { gql } from 'apollo-server';

// These type definitions are meant to expose everything that is not specific to some entity, and also
// to define types that will be extended by these specific entities (e.g. Query and Mutation)
export const mainTypeDefs = gql`
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

export default mainTypeDefs;
