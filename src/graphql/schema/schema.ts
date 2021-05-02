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
		address: String!
		dob: String!
		description: String
		createdAt: String!
		updatedAt: String
		imageUrl: String
	}

	input UserInput {
		name: String
		address: String
		description: String
		dob: String
	}
`;
