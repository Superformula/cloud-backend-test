import * as AWSMock from 'jest-aws-sdk-mock'
import AWS, { AWSError } from 'aws-sdk'
import {
	AttributeMap,
	AttributeValue,
	DeleteItemInput,
	DeleteItemOutput,
	GetItemInput,
	GetItemOutput,
	PutItemInput,
	PutItemOutput,
	ScanInput,
	ScanOutput,
} from 'aws-sdk/clients/dynamodb'
import * as uuid from 'uuid'
import { AddUserAsync, DeleteUserAsync, GetUserByIdAsync, ListUsersAsync, UpdateUserAsync } from '../../src/user-data-access'
import { Address, AddressInput, UserInput, UserListParams, UserPaginatedResponse } from '../../src/types/types'
import { jest, beforeAll, describe, it, expect, beforeEach } from '@jest/globals'

beforeAll(() => {
	AWSMock.setSDKInstance(AWS)
})

beforeAll(() => {
	AWSMock.restore()
})

jest.mock('uuid')

const addressInput: AddressInput = {
	latitude: -1,
	longitude: 1,
	place: 'place',
}

const address: Address = {
	latitude: -1,
	longitude: 1,
	place: 'place',
}

const addressAttributeMap: AttributeMap = {
	latitude: -1 as AttributeValue,
	longitude: 1 as AttributeValue,
	place: 'place' as AttributeValue,
}

const input: UserInput = {
	name: 'name',
	address: addressInput,
	description: 'description',
	dob: 'dob',
	imageUrl: 'imageUrl',
}

describe('Data access - GetUserByIdAsync tests', () => {
	it('should GetUserByIdAsync work as expected', async () => {
		const response: AttributeMap = {
			id: '' as AttributeValue,
			name: '' as AttributeValue,
			address: addressAttributeMap,
			createdAt: '' as AttributeValue,
			updatedAt: '' as AttributeValue,
			description: '' as AttributeValue,
			dob: '' as AttributeValue,
			imageUrl: '' as AttributeValue,
		}
		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback(null, { Item: response })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const id = ''

		expect(await GetUserByIdAsync(ddb, id)).toEqual(response)
	})

	it('should GetUserByIdAsync throw when receiving null response', async () => {
		AWSMock.mock(
			'DynamoDB.DocumentClient',
			'get',
			(_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput | null) => void) => {
				callback(null, null)
			}
		)

		const ddb = new AWS.DynamoDB.DocumentClient()

		const id = ''

		try {
			await GetUserByIdAsync(ddb, id)
		} catch (error) {
			expect(error.message).toMatch('Error on User get')
		}
	})

	it('should GetUserByIdAsync throw when receiving undefined user on response', async () => {
		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback(null, { Item: undefined })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const id = ''

		try {
			await GetUserByIdAsync(ddb, id)
		} catch (error) {
			expect(error.message).toMatch('Error on User get')
		}
	})

	it('should GetUserByIdAsync throw when receiving an error from server', async () => {
		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback({ code: '', message: '', name: '', time: new Date() }, { Item: undefined })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const id = ''

		try {
			await GetUserByIdAsync(ddb, id)
		} catch (error) {
			expect(error.message).toMatch('Error on User get')
		}
	})
})

describe('Data access - AddUserAsync tests', () => {
	beforeEach(() => {
		;(uuid.v4 as any).mockResolvedValue('id')
	})

	it('should AddUserAsync work as expected', async () => {
		const response: AttributeMap = {
			id: 'id' as AttributeValue,
			name: 'name' as AttributeValue,
			address: addressAttributeMap,
			createdAt: 'updatedAt' as AttributeValue,
			updatedAt: 'updatedAt' as AttributeValue,
			description: 'description' as AttributeValue,
			dob: 'dob' as AttributeValue,
			imageUrl: 'imageUrl' as AttributeValue,
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: PutItemInput, callback: (err: AWSError | null, data: PutItemOutput) => void) => {
			callback(null, {})
		})

		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback(null, { Item: response })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		expect(await AddUserAsync(ddb, input)).toEqual(response)
	})

	it('should AddUserAsync throw when receiving an error from server', async () => {
		AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: PutItemInput, callback: (err: AWSError | null, data: PutItemOutput) => void) => {
			callback({ code: '', message: '', name: '', time: new Date() }, {})
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		try {
			await AddUserAsync(ddb, input)
		} catch (error) {
			expect(error.message).toMatch('Error on User add/update')
		}
	})
})

describe('Data access - UpdateUserAsync tests', () => {
	it('should UpdateUserAsync work as expected', async () => {
		const userId = 'userId'

		const response: AttributeMap = {
			id: userId as AttributeValue,
			name: 'name' as AttributeValue,
			address: addressAttributeMap,
			createdAt: 'updatedAt' as AttributeValue,
			updatedAt: 'updatedAt' as AttributeValue,
			description: 'description' as AttributeValue,
			dob: 'dob' as AttributeValue,
			imageUrl: 'imageUrl' as AttributeValue,
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: PutItemInput, callback: (err: AWSError | null, data: PutItemOutput) => void) => {
			callback(null, {})
		})

		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback(null, { Item: response })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		expect(await UpdateUserAsync(ddb, userId, input)).toEqual(response)
	})

	it('should UpdateUserAsync throw when receiving an error from server', async () => {
		const userId = 'userId'

		AWSMock.mock('DynamoDB.DocumentClient', 'put', (_params: PutItemInput, callback: (err: AWSError | null, data: PutItemOutput) => void) => {
			callback({ code: '', message: '', name: '', time: new Date() }, {})
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		try {
			await UpdateUserAsync(ddb, userId, input)
		} catch (error) {
			expect(error.message).toMatch('Error on User add/update')
		}
	})
})

describe('Data access - DeleteUserAsync tests', () => {
	it('should DeleteUserAsync work as expected', async () => {
		const userId = 'userId'

		AWSMock.mock(
			'DynamoDB.DocumentClient',
			'delete',
			(_params: DeleteItemInput, callback: (err: AWSError | null, data: DeleteItemOutput) => void) => {
				callback(null, {})
			}
		)

		const ddb = new AWS.DynamoDB.DocumentClient()

		expect(await DeleteUserAsync(ddb, userId)).toBeTruthy()
	})

	it('should DeleteUserAsync throw when receiving an error from server', async () => {
		const userId = 'userId'

		AWSMock.mock(
			'DynamoDB.DocumentClient',
			'delete',
			(_params: DeleteItemInput, callback: (err: AWSError | null, data: DeleteItemOutput) => void) => {
				callback({ code: '', message: '', name: '', time: new Date() }, {})
			}
		)

		const ddb = new AWS.DynamoDB.DocumentClient()

		try {
			await DeleteUserAsync(ddb, userId)
		} catch (error) {
			expect(error.message).toMatch('Error on User delete')
		}
	})
})

describe('Data access - ListUsersAsync tests', () => {
	it('should ListUsersAsync work as expected with no filter and no pagination', async () => {
		const userId = 'userId'

		const userResponse: AttributeMap = {
			id: userId as AttributeValue,
			name: 'name' as AttributeValue,
			address: addressAttributeMap,
			createdAt: 'updatedAt' as AttributeValue,
			updatedAt: 'updatedAt' as AttributeValue,
			description: 'description' as AttributeValue,
			dob: 'dob' as AttributeValue,
			imageUrl: 'imageUrl' as AttributeValue,
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback(null, { Items: [userResponse] })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const expected: UserPaginatedResponse = {
			lastEvaluatedKey: undefined,
			users: [
				{
					id: userId,
					name: 'name',
					address: address,
					createdAt: 'updatedAt',
					updatedAt: 'updatedAt',
					description: 'description',
					dob: 'dob',
					imageUrl: 'imageUrl',
				},
			],
		}

		expect(await ListUsersAsync(ddb, {})).toEqual(expected)
	})

	it('should ListUsersAsync work as expected with filter and no pagination', async () => {
		const userId = 'userId'

		const userResponse: AttributeMap = {
			id: userId as AttributeValue,
			name: 'name' as AttributeValue,
			address: addressAttributeMap,
			createdAt: 'updatedAt' as AttributeValue,
			updatedAt: 'updatedAt' as AttributeValue,
			description: 'description' as AttributeValue,
			dob: 'dob' as AttributeValue,
			imageUrl: 'imageUrl' as AttributeValue,
		}

		const listingParams: UserListParams = {
			filter: 'Filter',
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback(null, { Items: [userResponse] })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const expected: UserPaginatedResponse = {
			lastEvaluatedKey: undefined,
			users: [
				{
					id: userId,
					name: 'name',
					address: address,
					createdAt: 'updatedAt',
					updatedAt: 'updatedAt',
					description: 'description',
					dob: 'dob',
					imageUrl: 'imageUrl',
				},
			],
		}

		expect(await ListUsersAsync(ddb, listingParams)).toEqual(expected)
	})

	it('should ListUsersAsync work as expected with pagination and no filter', async () => {
		const userId = 'userId'

		const userResponse: AttributeMap = {
			id: userId as AttributeValue,
			name: 'name' as AttributeValue,
			address: addressAttributeMap,
			createdAt: 'updatedAt' as AttributeValue,
			updatedAt: 'updatedAt' as AttributeValue,
			description: 'description' as AttributeValue,
			dob: 'dob' as AttributeValue,
			imageUrl: 'imageUrl' as AttributeValue,
		}

		const listingParams: UserListParams = {
			lastEvaluatedKey: 'Key',
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback(null, { Items: [userResponse] })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const expected: UserPaginatedResponse = {
			lastEvaluatedKey: undefined,
			users: [
				{
					id: userId,
					name: 'name',
					address: address,
					createdAt: 'updatedAt',
					updatedAt: 'updatedAt',
					description: 'description',
					dob: 'dob',
					imageUrl: 'imageUrl',
				},
			],
		}

		expect(await ListUsersAsync(ddb, listingParams)).toEqual(expected)
	})

	it('should ListUsersAsync work as expected with pagination and filter', async () => {
		const userListResponse: AttributeMap[] = []

		for (let i = 0; i < 2; ++i) {
			userListResponse.push({
				id: `${i}` as AttributeValue,
				name: 'name' as AttributeValue,
				address: addressAttributeMap,
				createdAt: 'updatedAt' as AttributeValue,
				updatedAt: 'updatedAt' as AttributeValue,
				description: 'description' as AttributeValue,
				dob: 'dob' as AttributeValue,
				imageUrl: 'imageUrl' as AttributeValue,
			})
		}

		const listingParams: UserListParams = {
			lastEvaluatedKey: 'Key',
			limit: 1,
		}

		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback(null, { Items: userListResponse })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const expected: UserPaginatedResponse = {
			lastEvaluatedKey: '0',
			users: [
				{
					id: '0',
					name: 'name',
					address: address,
					createdAt: 'updatedAt',
					updatedAt: 'updatedAt',
					description: 'description',
					dob: 'dob',
					imageUrl: 'imageUrl',
				},
			],
		}

		expect(await ListUsersAsync(ddb, listingParams)).toEqual(expected)
	})

	it('should ListUsersAsync throw when receiving an invalid response from server', async () => {
		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback(null, { Items: undefined })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		try {
			await ListUsersAsync(ddb, {})
		} catch (error) {
			expect(error.message).toMatch('Error on User list')
		}
	})

	it('should ListUsersAsync throw when receiving an error from server', async () => {
		AWSMock.mock('DynamoDB.DocumentClient', 'scan', (_params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => {
			callback({ code: '', message: '', name: '', time: new Date() }, {})
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		try {
			await ListUsersAsync(ddb, {})
		} catch (error) {
			expect(error.message).toMatch('Error on User list')
		}
	})
})
