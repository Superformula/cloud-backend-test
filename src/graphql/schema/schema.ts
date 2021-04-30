import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
	type Query {
		user(id: ID!): User!
	}

	type Mutation {
		createUser(data: UserInput!): User!
	}

	type User {
		id: ID!
		name: String!
		location: String!
		description: String
		createdAt: String!
		pictureUrl: String
	}

	input UserInput {
		name: String!
		location: String!
		description: String
	}
`;
