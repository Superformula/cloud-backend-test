import { CloudBackEndTestContext } from '../lambda-server'
import { Resolvers } from '../types'
import { DeleteUserAsync, GetUserByIdAsync, UpdateUserAsync, AddUserAsync, ListUsersAsync } from '../user-data-access'

export const UserResolvers: Resolvers<CloudBackEndTestContext> = {
	Query: {
		hello: (): string => 'Hello world!',
		getUser: async (_parent, { id }, { dynamo }) => {
			return await GetUserByIdAsync(dynamo, id)
		},
		listUsers: async (_parent, { params }, { dynamo }) => {
			return await ListUsersAsync(dynamo, params)
		},
	},
	Mutation: {
		addUser: async (_parent, { userInput }, { dynamo }) => {
			return await AddUserAsync(dynamo, userInput)
		},
		deleteUser: async (_parent, { id }, { dynamo }) => {
			return await DeleteUserAsync(dynamo, id)
		},
		updateUser: async (_parent, { id, userInput }, { dynamo }) => {
			return await UpdateUserAsync(dynamo, id, userInput)
		},
	},
}
