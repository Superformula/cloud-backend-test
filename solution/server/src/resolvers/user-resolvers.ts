import { CloudBackEndTestContext } from '../lambda-server'
import { FindAddressAsync } from '../mapbox-access'
import { Resolvers } from '../types/types'
import { DeleteUserAsync, GetUserByIdAsync, UpdateUserAsync, AddUserAsync, ListUsersAsync } from '../user-data-access'

export const UserResolver: Resolvers<CloudBackEndTestContext> = {
	Query: {
		getUser: async (_parent, { id }, { dynamo }) => {
			return await GetUserByIdAsync(dynamo, id)
		},
		listUsers: async (_parent, { params }, { dynamo }) => {
			return await ListUsersAsync(dynamo, params)
		},
		queryAddress: async (_parent, { location }, { mapbox }) => {
			const mapboxResponse = await FindAddressAsync(mapbox, location)
			return mapboxResponse.map((item) => {
				return {
					longitude: item.center[0],
					latitude: item.center[1],
					place: item.place_name,
				}
			})
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
