import { gql } from 'apollo-server';

export default gql`
	extend type Query {
		user(id: ID!): User!
	}

	extend type Mutation {
		createUser(input: UserCreationInput!): User!
		updateUser(id: ID!, input: UserUpdateInput!): User!
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
	input UserCreationInput {
		name: String!
		dob: String!
		address: String
		description: String
		imageUrl: String
	}

	"""
	Update user input type
	"""
	input UserUpdateInput {
		name: String
		dob: String
		address: String
		description: String
		imageUrl: String
	}
`;
