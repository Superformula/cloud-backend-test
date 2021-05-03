import { gql } from 'apollo-server';

export const userTypeDefs = gql`
	extend type Query {
		user(id: ID!): User!
		listUsers(paginationParams: PaginationInput, nameFilter: String): UserPaginationResult!
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

	"""
	Pagination parameters: 'limit' refers to the number of elements of each page, and 'exclusiveStartId' is the ID of the last element of the previous page
	"""
	input PaginationInput {
		limit: Int
		exclusiveStartId: ID
	}

	"""
	Result of a pagination of users: 'users' refers to the list of users of this page, and 'lastEvaluatedId' is the ID of the last element of the page;
	its presence indicates that there are more elements to be fetched.
	"""
	type UserPaginationResult {
		users: [User!]!
		lastEvaluatedId: ID
	}
`;

export default userTypeDefs;
