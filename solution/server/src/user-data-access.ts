import { User, UserInput, UserListParams, UserPaginatedResponse } from './types/types'
import { ApolloError } from 'apollo-server-errors'
import {
	AttributeValue,
	DeleteItemInput,
	GetItemInput,
	PutItemInput,
	PutItemInputAttributeMap,
	ScanInput,
	DocumentClient,
	ScanOutput,
	ItemList,
	AttributeMap,
} from 'aws-sdk/clients/dynamodb'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

const tableName = process.env.USERS_TABLE_NAME ?? ''

const defaultListLimit = 2

/**
 * Retrives an User by its ID
 * @param db The DynamoDB DocumentClient param
 * @param id The User ID
 * @returns The User
 */
export const GetUserByIdAsync = async (db: DocumentClient, id: string): Promise<User> => {
	try {
		const params: GetItemInput = {
			TableName: tableName,
			Key: {
				id: id as AttributeValue,
			},
		}

		const userDbObj = await db
			.get(params)
			.promise()
			.catch((err) => {
				throw err
			})

		if (!userDbObj || !userDbObj.Item) {
			throw new ApolloError(`No user was found`)
		}

		return attributeMapToUser(userDbObj.Item)
	} catch (error) {
		throw new ApolloError('Error on User get', error)
	}
}

/**
 * Retrieves an user list from the given params, alowing pagination and filtering
 * @param db The DynamoDB DocumentClient param
 * @param listingParams The pagination params
 * @returns The paginated user list
 */
export const ListUsersAsync = async (db: DocumentClient, listingParams: UserListParams): Promise<UserPaginatedResponse> => {
	try {
		// Set the base limit
		const limit = listingParams.limit ?? defaultListLimit
		const params: ScanInput = {
			TableName: tableName,
			Limit: limit,
		}

		// Check and add if there is a filter
		if (listingParams.filter) {
			params.FilterExpression = 'contains(#name, :filter)'
			params.ExpressionAttributeNames = {
				'#name': 'name',
			}
			params.ExpressionAttributeValues = {
				':filter': listingParams.filter as AttributeValue,
			}
		}

		// DynamoDB does not directly support pagination. The "limit" param just limits how many entities will be visited and not how many will be retrieved
		// That's why we must keep looking until there is no more entities to be visited or the user limit was satisfied
		// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html
		let userList: User[] = []
		let userDbObj: ScanOutput
		let lastEvaluatedKey = listingParams.lastEvaluatedKey as AttributeValue

		do {
			if (lastEvaluatedKey) {
				params.ExclusiveStartKey = {
					id: lastEvaluatedKey,
				}
			}

			userDbObj = await db
				.scan(params)
				.promise()
				.catch((err) => {
					throw err
				})

			if (!userDbObj || !userDbObj.Items) {
				throw new ApolloError(`No object was found on list Users`)
			}

			lastEvaluatedKey = userDbObj.LastEvaluatedKey?.id as AttributeValue
			if (userDbObj.Items) {
				userList = [...userList, ...itemListToUserList(userDbObj.Items)]
			}
		} while (userList.length < limit && lastEvaluatedKey)

		// Check if the final list is larger than the requested by the user, removing entries if necessary
		if (userList.length > limit) {
			while (userList.length > limit) {
				userList.pop()
			}

			// Set the "lastEvaluatedKey" param as the last User retrieved ID to start the next request from it.
			// We must do that to get the manually removed items
			const lastIndex = userList.length - 1
			lastEvaluatedKey = userList[lastIndex].id as AttributeValue
		}

		return {
			users: userList,
			lastEvaluatedKey: lastEvaluatedKey as string,
		}
	} catch (error) {
		throw new ApolloError('Error on User list', error)
	}
}

/**
 * Creates an User
 * @param db The DynamoDB DocumentClient param
 * @param fields User data
 * @returns The created user
 */
export const AddUserAsync = async (db: DocumentClient, fields: UserInput): Promise<User> => {
	const addUserData = genUserDataMap(fields) as PutItemInputAttributeMap
	addUserData['id'] = uuidv4() as AttributeValue
	addUserData['createdAt'] = addUserData['updatedAt']
	return AddOrUpdateUserAsync(db, addUserData)
}

/**
 * Updates an User
 * @param db The DynamoDB DocumentClient param
 * @param id The User ID
 * @param fields User data
 * @returns The updated User
 */
export const UpdateUserAsync = async (db: DocumentClient, id: string, fields: UserInput): Promise<User> => {
	const addUserData = genUserDataMap(fields) as PutItemInputAttributeMap
	addUserData['id'] = id as AttributeValue
	return AddOrUpdateUserAsync(db, addUserData)
}

/**
 * Add or Update users
 * @param db The DynamoDB DocumentClient param
 * @param data User Data
 * @returns User
 */
const AddOrUpdateUserAsync = async (db: DocumentClient, data: PutItemInputAttributeMap): Promise<User> => {
	try {
		const params: PutItemInput = {
			TableName: tableName,
			Item: data,
		}

		await db
			.put(params)
			.promise()
			.catch((err) => {
				throw err
			})
		return await GetUserByIdAsync(db, data['id'] as string)
	} catch (error) {
		throw new ApolloError('Error on User add/update', error)
	}
}

/**
 * Deletes an User
 * @param db The DynamoDB DocumentClient param
 * @param id The User ID
 * @returns If the user was deleted or not
 */
export const DeleteUserAsync = async (db: DocumentClient, id: string): Promise<boolean> => {
	try {
		const params: DeleteItemInput = {
			TableName: tableName,
			Key: {
				id: id as AttributeValue,
			},
		}

		await db
			.delete(params)
			.promise()
			.catch((err) => {
				throw err
			})

		return true
	} catch (error) {
		throw new ApolloError('Error on User delete', error)
	}
}

//
//
//  Utils
//
//

/**
 * Creates User data attribute map for DynamoDB
 * @param userInput User data
 * @returns User data attribute map for DynamoDB
 */
function genUserDataMap(userInput: UserInput): { [key: string]: AttributeValue } {
	const item: { [key: string]: AttributeValue } = {}

	if (userInput.name) {
		item['name'] = userInput.name as AttributeValue
	}

	if (userInput.dob) {
		item['dob'] = userInput.dob as AttributeValue
	}

	if (userInput.address) {
		const addressObj: AttributeMap = {
			place: userInput.address.place as AttributeValue,
			latitude: userInput.address.latitude as AttributeValue,
			longitude: userInput.address.longitude as AttributeValue,
		}
		item['address'] = addressObj
	}

	if (userInput.description) {
		item['description'] = userInput.description as AttributeValue
	}

	if (userInput.imageUrl) {
		item['imageUrl'] = userInput.imageUrl as AttributeValue
	}

	item['updatedAt'] = moment().toISOString() as AttributeValue

	return item
}

/**
 * Translates an ItemList to User list
 */
function itemListToUserList(itemList: ItemList): User[] {
	return itemList.map((item) => {
		return attributeMapToUser(item)
	})
}

/**
 * Translates an AttributeMap to User
 */
function attributeMapToUser(attMap: AttributeMap): User {
	return {
		id: attMap.id as string,
		name: attMap.name as string,
		address: {
			place: (attMap.address as AttributeMap).place as string,
			latitude: (attMap.address as AttributeMap).latitude as number,
			longitude: (attMap.address as AttributeMap).longitude as number,
		},
		createdAt: attMap.createdAt as string,
		updatedAt: attMap.updatedAt as string,
		description: attMap.description as string,
		dob: attMap.dob as string,
		imageUrl: attMap.imageUrl as string,
	}
}
