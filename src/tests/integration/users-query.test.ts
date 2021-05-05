import { UserModel } from '../../data-access/models/user';
import { createTestClient } from 'apollo-server-testing';
import { server } from '../../lambda';
import { awsResponse, getFn } from '../../__mocks__/aws-sdk/clients/dynamodb';
import { accessTokenEnvName } from '../../dist/configuration/mapbox';
import { usersTableEnvName } from '../../configuration/users-db';

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

		expect(result.errors).toBeUndefined();
		expect(result.data.user).toBeDefined();
		expect(result.data.user.id).toBe(mockUser.id);
		expect(result.data.user.name).toBe(mockUser.name);
		expect(result.data.user.address).toBe(mockUser.address);
		expect(result.data.user.dob).toBe(mockUser.dob);
		expect(result.data.user.description).toBe(mockUser.description);
		expect(result.data.user.createdAt).toBe(mockUser.createdAt);

		expect(getFn).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Key: { id: mockUser.id },
		});
	});
});
