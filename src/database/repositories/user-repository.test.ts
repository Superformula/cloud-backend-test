import { BatchGetResponseMap, DocumentClient, ItemList, ScanInput } from 'aws-sdk/clients/dynamodb';
import moment from 'moment';
import { UserInput } from '../../graphql/types/schema-types';
import { UserModel } from '../models/user';
import { DynamoDBUserRepository, UserRepository } from './user-repository';
import { awsSdkPromiseResponse } from './__mocks__/aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { AttributeValue } from 'aws-sdk/clients/directoryservice';
import { Optional, WithIndexSignature } from '../../utils/types';
import { ApolloError } from 'apollo-server-errors';

const testTableName = 'TestUserTable';
const testIndexName = 'UserNameIndex';

describe('Test user repository creation', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		process.env = { ...OLD_ENV }; // We want to reset process.env state while calling each test
	});

	it('Should be created if users table environment variable is set', () => {
		const databaseMock = new DocumentClient();
		process.env['USERS_TABLE_NAME'] = testTableName;
		const repo = new DynamoDBUserRepository(databaseMock);
		expect(repo).toBeDefined();
	});

	it('Should throw error if users table environment variable is not set', () => {
		const databaseMock = new DocumentClient();
		process.env['USERS_TABLE_NAME'] = undefined;
		try {
			new DynamoDBUserRepository(databaseMock);
		} catch (error) {
			expect(error.message).toBe('No users table name provided');
		}
	});
});

describe('Test user retrieval', () => {
	const testTableName = 'TestUserTable';
	const mockUser: UserModel = {
		id: '1234',
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
	};

	beforeEach(() => {
		process.env['USERS_TABLE_NAME'] = testTableName;
	});

	it('Should be retrieved if found', async () => {
		const databaseMock = new DocumentClient();
		const repo = new DynamoDBUserRepository(databaseMock);
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: mockUser }));

		const user = await repo.getUser(mockUser.id);
		expect(databaseMock.get).toHaveBeenCalledWith({
			TableName: testTableName,
			Key: { id: mockUser.id },
		});
		expect(user).toEqual(mockUser);
	});

	it('Error should be thrown if not found', async () => {
		const databaseMock = new DocumentClient();
		const repo = new DynamoDBUserRepository(databaseMock);
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: null }));

		let user: UserModel | null = null;
		try {
			user = await repo.getUser(mockUser.id);
		} catch (error) {
			expect(error.message).toBe(`Could not find user with id ${mockUser.id}`);
		}

		expect(user).toBeNull();
		expect(databaseMock.get).toHaveBeenCalledWith({
			TableName: testTableName,
			Key: { id: mockUser.id },
		});
	});
});

describe('Test user creation', () => {
	const mockInput = {
		address: 'Brasilia, Brazil',
		dob: '1995-09-03',
		name: 'Test user',
		description: 'Test description',
	} as UserInput;

	const setup = () => {
		const database = new DocumentClient();
		const now = moment();
		Date.now = jest.fn().mockReturnValue(now);
		return {
			database,
			repository: new DynamoDBUserRepository(database),
			now,
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
		process.env['USERS_TABLE_NAME'] = testTableName;
	});

	it('Should be created with valid input', async () => {
		const { database, repository, now } = setup();

		const user = await repository.createUser(mockInput);
		expect(database.put).toHaveBeenCalledWith({
			TableName: testTableName,
			Item: user,
		});

		expect(user.address).toBe(mockInput.address);
		expect(user.description).toBe(mockInput.description);
		expect(user.name).toBe(mockInput.name);
		expect(user.dob).toBe(moment(mockInput.dob).toISOString());
		expect(user.createdAt).toBe(now.toISOString());
		expect(user.id).toBe(uuid());
	});

	it('Should throw error if name missing', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.name = undefined;

		await assertInvalidInputError(repository, input, 'The name must be specified');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if dob missing', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.dob = undefined;

		await assertInvalidInputError(repository, input, 'The date of birth must be specified');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if address missing', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.address = undefined;

		await assertInvalidInputError(repository, input, 'The address must be specified');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if address missing', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.address = undefined;

		await assertInvalidInputError(repository, input, 'The address must be specified');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if invalid dob provided', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.dob = '1999-12-32';

		await assertInvalidInputError(repository, input, 'An invalid date of birth was provided');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if address exceeds max length', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.address = 'A'.repeat(251);

		await assertInvalidInputError(repository, input, 'The address max length is 250 characters');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if name exceeds max length', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.name = 'A'.repeat(101);

		await assertInvalidInputError(repository, input, 'The name max length is 100 characters');
		expect(database.put).toHaveBeenCalledTimes(0);
	});

	it('Should throw error if description exceeds max length', async () => {
		const { database, repository } = setup();

		const input: UserInput = { ...mockInput };
		input.description = 'A'.repeat(1001);

		await assertInvalidInputError(repository, input, 'The description max length is 1000 characters');
		expect(database.put).toHaveBeenCalledTimes(0);
	});
});

describe('Test user update', () => {
	const mockInput = {
		address: 'Rio de Janeiro, Brazil',
		dob: '1995-09-04',
		name: 'Test user updated',
		description: 'Test description updated',
	} as UserInput;

	const existingUser: UserModel = {
		id: uuid(),
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
	};

	const setup = () => {
		const database = new DocumentClient();
		const now = moment();
		Date.now = jest.fn().mockReturnValue(now);
		return {
			database,
			repository: new DynamoDBUserRepository(database),
			now,
		};
	};

	beforeEach(() => {
		process.env['USERS_TABLE_NAME'] = testTableName;
	});

	it('Should be updated with valid inputs', async () => {
		const { database, repository, now } = setup();
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: { ...existingUser } }));

		const user = await repository.updateUser(existingUser.id, mockInput);
		expect(database.put).toHaveBeenCalledWith({
			TableName: testTableName,
			Item: user,
		});

		expect(user.address).toBe(mockInput.address);
		expect(user.description).toBe(mockInput.description);
		expect(user.name).toBe(mockInput.name);
		expect(user.dob).toBe(moment(mockInput.dob).toISOString());
		expect(user.updatedAt).toBe(now.toISOString());
		expect(user.id).toBe(uuid());
	});

	it('Should remain the same if no field was specified', async () => {
		const { database, repository } = setup();
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Item: { ...existingUser } }));

		const user = await repository.updateUser(existingUser.id, {});
		expect(database.put).toHaveBeenCalledWith({
			TableName: testTableName,
			Item: user,
		});

		expect(user.address).toBe(existingUser.address);
		expect(user.description).toBe(existingUser.description);
		expect(user.name).toBe(existingUser.name);
		expect(user.dob).toBe(existingUser.dob);
	});
});

describe('Test user delete', () => {
	const existingUser: UserModel = {
		id: uuid(),
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
	};

	const setup = () => {
		const database = new DocumentClient();
		return {
			database,
			repository: new DynamoDBUserRepository(database),
		};
	};

	beforeEach(() => {
		process.env['USERS_TABLE_NAME'] = testTableName;
	});

	it('Should be deleted if user exisits', async () => {
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Attributes: { ...existingUser } }));
		const { database, repository } = setup();

		const user = await repository.deleteUser(existingUser.id);
		expect(database.delete).toHaveBeenCalledWith({
			TableName: testTableName,
			Key: { id: existingUser.id },
		});

		expect(user.address).toBe(existingUser.address);
		expect(user.description).toBe(existingUser.description);
		expect(user.name).toBe(existingUser.name);
		expect(user.dob).toBe(existingUser.dob);
	});

	it('Should return null if not found', async () => {
		awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({ Attributes: null }));
		const { database, repository } = setup();

		const user = await repository.deleteUser(uuid());
		expect(database.delete).toHaveBeenCalledWith({
			TableName: testTableName,
			Key: { id: uuid() },
		});

		expect(user).toBeNull();
	});
});

describe('Test user list', () => {
	const existingUsers: WithIndexSignature<UserModel, AttributeValue>[] = [
		{
			id: '1234',
			address: 'Brasilia, Brazil',
			dob: '1995-09-03T00:00:00.000Z',
			name: 'Test user',
			description: 'Test description',
			createdAt: '2021-05-01T17:52:48.299Z',
		},
		{
			id: '5678',
			address: 'Rio de Janeiro, Brazil',
			dob: '1996-09-04T00:00:00.000Z',
			name: 'Test user 2',
			description: 'Test description 2',
			createdAt: '2021-03-01T17:52:48.299Z',
		},
	];

	const mockResponses = (expectedCursor: Optional<string>) => {
		const batchGetResponse: BatchGetResponseMap = {};
		batchGetResponse[testTableName] = existingUsers as ItemList;
		awsSdkPromiseResponse
			.mockReturnValueOnce(
				Promise.resolve({
					Items: existingUsers.map((u) => ({
						id: u.id,
						name: u.name,
					})),
					LastEvaluatedKey: expectedCursor,
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
					Responses: batchGetResponse,
				}),
			);
	};

	const setup = () => {
		const database = new DocumentClient();
		return {
			database,
			repository: new DynamoDBUserRepository(database),
		};
	};

	beforeEach(() => {
		process.env['USERS_TABLE_NAME'] = testTableName;
	});

	it('Should scan table without query', async () => {
		const pageSize = 2;
		const expectedCursor = '12345';
		const { database, repository } = setup();

		mockResponses(expectedCursor);

		const result = await repository.listUsers(null, pageSize, null);
		expect(database.scan).toHaveBeenCalledWith({
			TableName: testTableName,
			Limit: pageSize,
			IndexName: testIndexName,
			ExclusiveStartKey: undefined,
		});

		expect(result.cursor).toBe(JSON.stringify(expectedCursor));
		expect(result.items).toEqual(existingUsers);
	});

	it('Should query table with query', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const expectedCursor = '12345';
		const expectedExpression = '#name = :query';
		const expectedAttributeNames = { '#name': 'name' };
		const { database, repository } = setup();

		mockResponses(expectedCursor);

		const result = await repository.listUsers(query, pageSize, null);
		expect(database.query).toHaveBeenCalledWith({
			TableName: testTableName,
			Limit: pageSize,
			IndexName: testIndexName,
			ExclusiveStartKey: undefined,
			ExpressionAttributeValues: { ':query': query },
			KeyConditionExpression: expectedExpression,
			ExpressionAttributeNames: expectedAttributeNames,
		});

		expect(result.cursor).toBe(JSON.stringify(expectedCursor));
		expect(result.items).toEqual(existingUsers);
	});

	test('if cursor is passed to DynamoDB on query', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const expectedCursor = '12345';
		const expectedExpression = '#name = :query';
		const expectedAttributeNames = { '#name': 'name' };
		const { database, repository } = setup();

		mockResponses(expectedCursor);

		await repository.listUsers(query, pageSize, expectedCursor);
		expect(database.query).toHaveBeenCalledWith({
			TableName: testTableName,
			Limit: pageSize,
			IndexName: testIndexName,
			ExclusiveStartKey: JSON.parse(expectedCursor),
			ExpressionAttributeValues: { ':query': query },
			KeyConditionExpression: expectedExpression,
			ExpressionAttributeNames: expectedAttributeNames,
		});
	});

	test('If cursor is null on last page', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const { repository } = setup();

		mockResponses(null);

		const result = await repository.listUsers(query, pageSize, null);
		expect(result.cursor).toBeNull();
	});

	it('Should return empty list if query on index returns null items', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const { repository } = setup();

		awsSdkPromiseResponse.mockReturnValueOnce(
			Promise.resolve({
				Items: null,
				LastEvaluatedKey: null,
			}),
		);

		const result = await repository.listUsers(query, pageSize, null);
		expect(result.items).toEqual([]);
	});

	it('Should return empty list if query on index returns empty list', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const { repository } = setup();

		awsSdkPromiseResponse.mockReturnValueOnce(
			Promise.resolve({
				Items: [],
				LastEvaluatedKey: null,
			}),
		);

		const result = await repository.listUsers(query, pageSize, null);
		expect(result.items).toEqual([]);
	});

	it('Should return throw error if batchGet on table returns null responses', async () => {
		const pageSize = 2;
		const query = 'Test query';
		const { repository } = setup();

		awsSdkPromiseResponse
			.mockReturnValueOnce(
				Promise.resolve({
					Items: existingUsers.map((u) => ({
						id: u.id,
						name: u.name,
					})),
					LastEvaluatedKey: null,
				}),
			)
			.mockReturnValueOnce(
				Promise.resolve({
					Responses: null,
				}),
			);

		try {
			await repository.listUsers(query, pageSize, null);
			fail();
		} catch (error) {
			expect(error.message).toBe('Unexpected batch get items result');
		}
	});
});

const assertInvalidInputError = async (repository: UserRepository, input: UserInput, errorMessage: string) => {
	let user: UserModel | null = null;
	try {
		user = await repository.createUser(input);
	} catch (error) {
		expect(error.message).toBe(errorMessage);
	}

	expect(user).toBeNull();
};
