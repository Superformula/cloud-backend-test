import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
	type Query {
		user(id: ID!): User!
		users(query: String, limit: Int!, cursor: String): UserPage!
	}

	type Mutation {
		createUser(data: UserInput!): User!
		updateUser(id: ID!, data: UserInput!): User!
		deleteUser(id: ID!): User
	}

	type UserPage {
		items: [User]!
		cursor: String
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
