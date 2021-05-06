import { createTestClient } from 'apollo-server-testing';
import { server } from '../../lambda';
import { putFn } from '../../__mocks__/aws-sdk/clients/dynamodb';
import { accessTokenEnvName } from '../../dist/configuration/mapbox';
import { usersTableEnvName } from '../../configuration/users-db';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { UserInput } from '../../graphql/types/schema-types';

describe('Mutate user', () => {
	const mockUserInput: UserInput = {
		address: 'Brasilia, Brazil',
		dob: '1995-09-03',
		name: 'Test user',
		description: 'Test description',
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const setup = () => {
		process.env[usersTableEnvName] = 'test-table';
		process.env[accessTokenEnvName] = 'test-access-token';
		const now = moment();
		Date.now = jest.fn().mockReturnValue(now);
		return {
			testclient: createTestClient(server),
			now,
		};
	};

	const getExpectedResults = (now: moment.Moment) => {
		const createdUserModel = {
			...mockUserInput,
			createdAt: now.toISOString(),
			// This uuid is mocked
			id: uuid(),
			dob: moment(mockUserInput.dob).toISOString(),
		};

		const expectedReturnedUser = {
			...createdUserModel,
			updatedAt: null,
			imageUrl: `https://picsum.photos/seed/${uuid()}/200/300`,
		};

		return {
			createdUserModel,
			expectedReturnedUser,
		};
	};

	it('Should create user and return if correct input', async () => {
		const {
			testclient: { mutate },
			now,
		} = setup();

		const result = await mutate({
			mutation: `
                mutation {
                    createUser(data: {
                        name: "${mockUserInput.name}"
                        address: "${mockUserInput.address}"
                        description: "${mockUserInput.description}"
                        dob: "${mockUserInput.dob}"
                     }){
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

		const { expectedReturnedUser, createdUserModel } = getExpectedResults(now);
		expect(result.errors).toBeUndefined();
		expect(result.data.createUser).toEqual(expectedReturnedUser);

		expect(putFn).toHaveBeenCalledWith({
			TableName: process.env[usersTableEnvName],
			Item: createdUserModel,
		});
	});

	it('Should return error with invalid input', async () => {
		const {
			testclient: { mutate },
		} = setup();

		const result = await mutate({
			mutation: `
                mutation {
                    createUser(data: {
                        name: "${mockUserInput.name}"
                        address: "${mockUserInput.address}"
                        description: "${mockUserInput.description}"
                        dob: "03-09-1995"
                     }){
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

		expect(result.errors).toBeDefined();
		expect(result.errors?.length).toBe(1);
		expect(result.errors?.[0].message).toBe('An invalid date of birth was provided');
		expect(result.data).toBeNull();

		expect(putFn).toHaveBeenCalledTimes(0);
	});
});
