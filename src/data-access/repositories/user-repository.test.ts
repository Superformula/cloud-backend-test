import { BatchGetResponseMap, DocumentClient, ItemList } from 'aws-sdk/clients/dynamodb';
import moment from 'moment';
import { UserInput } from '../../graphql/types/schema-types';
import { UserModel } from '../models/user';
import { DynamoDBUserRepository, UserRepository } from './user-repository';
import { v4 as uuid } from 'uuid';
import { WithIndexSignature } from '../../utils/types';
import { Maybe } from 'graphql/jsutils/Maybe';
import dotenv from 'dotenv';
import { configureUsersDB, nameIndexEnvName, usersTableEnvName } from '../../configuration/users-db';
import { awsResponse } from '../../__mocks__/aws-sdk/clients/dynamodb';
dotenv.config();

describe('Test user retrieval', () => {
	const mockUser: UserModel = {
		id: '1234',
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
	};

	it('Should be retrieved if found', async () => {
		const databaseMock = new DocumentClient();
		const repo = new DynamoDBUserRepository(databaseMock, configureUsersDB());
		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: mockUser }));

		const user = await repo.getUser(mockUser.id);
		expect(databaseMock.get).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Key: { id: mockUser.id },
		});
		expect(user).toEqual(mockUser);
	});

	it('Error should be thrown if not found', async () => {
		const databaseMock = new DocumentClient();
		const repo = new DynamoDBUserRepository(databaseMock, configureUsersDB());
		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: null }));

		let user: UserModel | null = null;
		try {
			user = await repo.getUser(mockUser.id);
		} catch (error) {
			expect(error.message).toBe(`Could not find user with id ${mockUser.id}`);
		}

		expect(user).toBeNull();
		expect(databaseMock.get).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
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
			repository: new DynamoDBUserRepository(database, configureUsersDB()),
			now,
		};
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should be created with valid input', async () => {
		const { database, repository, now } = setup();

		const user = await repository.createUser(mockInput);
		expect(database.put).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
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
			repository: new DynamoDBUserRepository(database, configureUsersDB()),
			now,
		};
	};

	it('Should be updated with valid inputs', async () => {
		const { database, repository, now } = setup();
		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: { ...existingUser } }));

		const user = await repository.updateUser(existingUser.id, mockInput);
		expect(database.put).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
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
		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: { ...existingUser } }));

		const user = await repository.updateUser(existingUser.id, {});
		expect(database.put).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
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
			repository: new DynamoDBUserRepository(database, configureUsersDB()),
		};
	};

	it('Should be deleted if user exisits', async () => {
		awsResponse.mockReturnValueOnce(Promise.resolve({ Attributes: { ...existingUser } }));
		const { database, repository } = setup();

		const user = await repository.deleteUser(existingUser.id);
		expect(database.delete).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Key: { id: existingUser.id },
		});

		expect(user.address).toBe(existingUser.address);
		expect(user.description).toBe(existingUser.description);
		expect(user.name).toBe(existingUser.name);
		expect(user.dob).toBe(existingUser.dob);
	});

	it('Should return null if not found', async () => {
		awsResponse.mockReturnValueOnce(Promise.resolve({ Attributes: null }));
		const { database, repository } = setup();

		const user = await repository.deleteUser(uuid());
		expect(database.delete).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Key: { id: uuid() },
		});

		expect(user).toBeNull();
	});
});

describe('Test user list', () => {
	const existingUsers: WithIndexSignature<UserModel, string>[] = [
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

	const mockResponses = (expectedCursor: Maybe<string>) => {
		const batchGetResponse: BatchGetResponseMap = {};
		batchGetResponse[process.env[usersTableEnvName] as string] = existingUsers as ItemList;
		awsResponse
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
			repository: new DynamoDBUserRepository(database, configureUsersDB()),
		};
	};

	it('Should scan table without query', async () => {
		const pageSize = 2;
		const expectedCursor = '12345';
		const { database, repository } = setup();

		mockResponses(expectedCursor);

		const result = await repository.listUsers(null, pageSize, null);
		expect(database.scan).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Limit: pageSize,
			IndexName: process.env[nameIndexEnvName],
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
			TableName: process.env[usersTableEnvName],
			Limit: pageSize,
			IndexName: process.env[nameIndexEnvName],
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
			TableName: process.env[usersTableEnvName],
			Limit: pageSize,
			IndexName: process.env[nameIndexEnvName],
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

		awsResponse.mockReturnValueOnce(
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

		awsResponse.mockReturnValueOnce(
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

		awsResponse
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
