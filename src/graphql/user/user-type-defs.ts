import { gql } from 'apollo-server';

export default gql`
	extend type Query {
		user(id: ID!): User!
	}

	extend type Mutation {
		createUser(input: CreateUserInput!): User!
		updateUser(input: UpdateUserInput!): User!
		deleteUser(id: ID!): User!
	}

	"""
	User type
	"""
	type User {
		_id: ID!
		name: String!
		dob: String!
		address: String
		description: String
		imageUrl: String
		createdAt: String!
		updatedAt: String!
	}

	"""
	Create user input type
	"""
	input CreateUserInput {
		name: String!
		dob: String!
		address: String
		description: String
		imageUrl: String
	}

	"""
	Update user input type
	"""
	input UpdateUserInput {
		name: String
		dob: String
		address: String
		description: String
		imageUrl: String
	}
`;
