import { UserModel } from '../../data-access/models/user';
import { createTestClient } from 'apollo-server-testing';
import { server } from '../../lambda';
import { awsResponse, getFn, queryFn, scanFn } from '../../__mocks__/aws-sdk/clients/dynamodb';
import { accessTokenEnvName } from '../../dist/configuration/mapbox';
import { nameIndexEnvName, usersTableEnvName } from '../../configuration/users-db';
import { WithIndexSignature } from '../../utils/types';
import { BatchGetResponseMap, ItemList } from 'aws-sdk/clients/dynamodb';
import { Maybe } from 'graphql/jsutils/Maybe';
import moment from 'moment';

describe('Query by id', () => {
	const mockUser: UserModel = {
		id: '1234',
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
		updatedAt: '2021-06-01T17:52:48.299Z',
	};

	const setup = () => {
		process.env[usersTableEnvName] = 'test-table';
		process.env[accessTokenEnvName] = 'test-access-token';
		return createTestClient(server);
	};

	it('Should return all fields if found', async () => {
		const { query } = setup();

		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: mockUser }));
		const result = await query({
			query: `
                query {
                    user(id: ${mockUser.id}) {
                        id
                        name
                        address
                        dob
                        description
                        createdAt
                        updatedAt
                        imageUrl
                    }
                }
            `,
		});

		const expectedReturnedUser = {
			...mockUser,
			imageUrl: 'https://picsum.photos/seed/1234/200/300',
		};

		expect(result.errors).toBeUndefined();
		expect(result.data.user).toBeDefined();
		expect(result.data.user).toEqual(expectedReturnedUser);

		expect(getFn).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Key: { id: mockUser.id },
		});
	});

	it('Should return error if not found', async () => {
		const { query } = setup();

		awsResponse.mockReturnValueOnce(Promise.resolve({ Item: null }));
		const result = await query({
			query: `
                query {
                    user(id: ${mockUser.id}) {
                        id
                        name
                        address
                        dob
                        description
                        createdAt
                        updatedAt
                        imageUrl
                    }
                }
            `,
		});

		expect(result.data).toBeNull();
		expect(result.errors).toBeDefined();
		expect(result.errors?.length).toBe(1);
		expect(result.errors?.[0].message).toBe('Could not find user with id 1234');
	});
});

describe('List users', () => {
	const existingUsers: WithIndexSignature<UserModel, string>[] = [
		{
			id: '1234',
			address: 'Brasilia, Brazil',
			dob: '1995-09-03T00:00:00.000Z',
			name: 'Test user',
			description: 'Test description',
			createdAt: '2021-05-01T17:52:48.299Z',
			updatedAt: '2021-05-22T17:52:48.299Z',
			imageUrl: 'https://picsum.photos/seed/1234/200/300',
		},
		{
			id: '5678',
			address: 'Rio de Janeiro, Brazil',
			dob: '1996-09-04T00:00:00.000Z',
			name: 'Test user 2',
			description: 'Test description 2',
			createdAt: '2021-03-01T17:52:48.299Z',
			updatedAt: '2021-04-22T17:52:48.299Z',
			imageUrl: 'https://picsum.photos/seed/5678/200/300',
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
		process.env[usersTableEnvName] = 'test-table';
		process.env[nameIndexEnvName] = 'test-name-index';
		process.env[accessTokenEnvName] = 'test-access-token';
		return createTestClient(server);
	};

	it('Should query the database with provided parameters and return users', async () => {
		const { query } = setup();

		const pageSize = 10;
		const name = 'Teste';
		const testCursor = '123456';
		const expectedExpression = '#name = :query';
		const expectedAttributeNames = { '#name': 'name' };
		mockResponses(null);

		const result = await query({
			query: `
                query {
                    users(limit: ${pageSize}, query: "${name}", cursor: "${testCursor}") {
                        items {
                            id
                            name
                            address
                            dob
                            description
                            createdAt
                            updatedAt
                            imageUrl
                        }
                        cursor
                    }
                }
            `,
		});

		expect(result.errors).toBeUndefined();
		expect(result.data.users.items).toEqual(existingUsers);

		expect(queryFn).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Limit: pageSize,
			IndexName: process.env[nameIndexEnvName],
			ExclusiveStartKey: JSON.parse(testCursor),
			ExpressionAttributeValues: { ':query': name },
			KeyConditionExpression: expectedExpression,
			ExpressionAttributeNames: expectedAttributeNames,
		});
	});

	it('Should return a cursor if lastevaluatedkey returned by dynamo', async () => {
		const { query } = setup();

		const pageSize = 10;
		const testCursor = '123456';
		mockResponses(testCursor);

		const result = await query({
			query: `
                query {
                    users {
                        items {
                            id
                            name
                            address
                            dob
                            description
                            createdAt
                            updatedAt
                            imageUrl
                        }
                        cursor
                    }
                }
            `,
		});

		expect(result.errors).toBeUndefined();
		expect(result.data.users.items).toEqual(existingUsers);
		expect(result.data.users.cursor).toEqual(JSON.stringify(testCursor));

		expect(scanFn).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Limit: pageSize,
			IndexName: process.env[nameIndexEnvName],
			ExclusiveStartKey: undefined,
		});
	});
});
