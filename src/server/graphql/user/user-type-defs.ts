import { gql } from 'apollo-server';

export const userTypeDefs = gql`
	extend type Query {
		"""
		This is the API to fetch data from a user whose ID is the parameter "id"
		"""
		user(id: ID!): User!

		"""
		This is the API to fetch a paginated list of users. "paginationParams" includes information to deal with the pagination, and "nameFilter" will filter the user records by name,
		including only users whose name includes the value of the parameter "nameFilter". If no "paginationParams" is passed, a complete list will be returned, and if "nameFilter"
		is not passed, no filtering will be made.
		"""
		listUsers(paginationParams: PaginationInput, nameFilter: String): UserPaginationResult!
	}

	extend type Mutation {
		"""
		This is the API to create a new user record with the data inside "input"
		"""
		createUser(input: UserCreationInput!): User!

		"""
		This is the API to update an existing user record whose ID is the parameter "id" with the data inside "input"
		"""
		updateUser(id: ID!, input: UserUpdateInput!): User!

		"""
		This is the API to delete an existing user record whose ID is the parameter "id"
		"""
		deleteUser(id: ID!): User!
	}

	"""
	User type
	"""
	type User {
		"""
		ID of the user record (non-nullable)
		"""
		_id: ID!

		"""
		Name of the user (non-nullable)
		"""
		name: String!

		"""
		Date of birth of the user (non-nullable)
		"""
		dob: String!

		"""
		Address of the user
		"""
		address: String

		"""
		Description of the user
		"""
		description: String

		"""
		The URL of the user image
		"""
		imageUrl: String

		"""
		Date in UTC that represents when the user record was created (non-nullable)
		"""
		createdAt: String!

		"""
		Date in UTC that represents the last time the user record was updated (non-nullable)
		"""
		updatedAt: String!
	}

	"""
	Input used when creating a user
	"""
	input UserCreationInput {
		"""
		Name of the user (non-nullable)
		"""
		name: String!

		"""
		Date of birth of the user (non-nullable)
		"""
		dob: String!

		"""
		Address of the user
		"""
		address: String

		"""
		Description of the user
		"""
		description: String

		"""
		The URL of the user image
		"""
		imageUrl: String
	}

	"""
	Input used when updating a user
	"""
	input UserUpdateInput {
		"""
		Name of the user
		"""
		name: String

		"""
		Date of birth of the user
		"""
		dob: String

		"""
		Address of the user
		"""
		address: String

		"""
		Description of the user
		"""
		description: String

		"""
		The URL of the user image
		"""
		imageUrl: String
	}

	"""
	Parameters used when paginating a list
	"""
	input PaginationInput {
		"""
		'limit' refers to the number of elements of each page
		"""
		limit: Int

		"""
		'exclusiveStartId' is the ID of the last element of the previous page, and is used by DynamoDB as "checkpoint" when fetching the page
		"""
		exclusiveStartId: ID
	}

	"""
	When listing users, this is the type that will be returned
	"""
	type UserPaginationResult {
		"""
		'users' refers to the list of users of this page
		"""
		users: [User!]!

		"""
		'lastEvaluatedId' is the ID of the last element of the page; its presence indicates that there are more elements to be fetched. When sending the request
		for the next page, include this value in the property "exclusiveStartId" of PaginationInput to indicate to DynamoDB where the last page stopped.
		"""
		lastEvaluatedId: ID
	}
`;

export default userTypeDefs;
