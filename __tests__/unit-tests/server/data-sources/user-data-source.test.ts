import {
	DeleteItemInput,
	DeleteItemOutput,
	DocumentClient,
	GetItemInput,
	GetItemOutput,
	PutItemInput,
	PutItemOutput,
	ScanInput,
	ScanOutput,
	UpdateItemInput,
	UpdateItemOutput,
} from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk';
import { conditionalCheckFailedErrorCode, UserDataSource } from '../../../../src/server/data-sources/user-data-source';
import UserModel, { UserCreationModel, UserUpdateModel } from '../../../../src/server/data-source-models/user-models';
import { mocked } from 'ts-jest/utils';
import ErrorCodes from '../../../../src/server/enums/error-codes';

// ----- TYPE DEFS -----

type DocumentClientGetType = (
	params: GetItemInput,
	callback: (err: AWSError | null, data: GetItemOutput) => void,
) => void;

type DocumentClientScanType = (params: ScanInput, callback: (err: AWSError | null, data: ScanOutput) => void) => void;

type DocumentClientPutType = (
	params: PutItemInput,
	callback: (err: AWSError | null, data: PutItemOutput) => void,
) => void;

type DocumentClientUpdateType = (
	params: UpdateItemInput,
	callback: (err: AWSError | null, data: UpdateItemOutput) => void,
) => void;

type DocumentClientDeleteType = (
	params: DeleteItemInput,
	callback: (err: AWSError | null, data: DeleteItemOutput) => void,
) => void;

// ----- MOCKS -----

const mockUserModel: UserModel = {
	id: '12345',
	name: 'Bob',
	dob: '22/05/1987',
	createdAt: 'Tue, 04 May 2021 03:29:33 GMT',
	updatedAt: 'Tue, 04 May 2021 03:29:33 GMT',
};

const mockCreationModel: UserCreationModel = {
	name: 'Alice',
	dob: '18/08/1998',
};

const mockUpdateModel: UserUpdateModel = {
	dob: '18/08/1995',
};

// Mocking DocumentClient and its methods "get", "scan", "put", "update", and "delete"
jest.mock('aws-sdk/clients/dynamodb', () => {
	return {
		DocumentClient: jest.fn(() => ({
			get: jest.fn(),
			scan: jest.fn(),
			put: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		})),
	};
});

// ----- TESTS -----

describe('server > data-sources > UserDataSource > getItem', () => {
	test('If an ID of an existing user is passed to getItem, it should return this user', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "get" command will succeed and return the mock user model
		mocked(mockDocClient.get as DocumentClientGetType).mockImplementation(
			(_params: GetItemInput, callback: (error: AWSError | null, data: DocumentClient.GetItemOutput) => void) => {
				callback(null, { Item: mockUserModel });
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		// ----- Act -----
		const userModel = await userDataSource.getItem(mockUserModel.id);

		// ----- Assert -----
		expect(userModel).toBeDefined();
		expect(userModel).toEqual(mockUserModel);
	});

	test('If an ID of a non-existent user is passed to getItem, it should throw exception indicating it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "get" command will return an empty object since it did not find the user
		mocked(mockDocClient.get as DocumentClientGetType).mockImplementation(
			(_params: GetItemInput, callback: (error: AWSError | null, data: DocumentClient.GetItemOutput) => void) => {
				callback(null, {});
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(1);

		try {
			// ----- Act -----
			await userDataSource.getItem(mockUserModel.id);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.USER_NOT_FOUND);
		}
	});

	test('An error from DynamoDB should make getItem throw exception telling that the "get" command failed', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		const mockAwsErrorCode = 'ResourceNotFoundException';
		// in this mock, "get" command will fail and return the error
		mocked(mockDocClient.get as DocumentClientGetType).mockImplementation(
			(_params: GetItemInput, callback: (error: AWSError | null, data: DocumentClient.GetItemOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'Requested resource not found',
						code: mockAwsErrorCode,
						name: mockAwsErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.getItem(mockUserModel.id);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.GET_USER_FAILED);
			expect(error.code).toMatch(mockAwsErrorCode);
		}
	});
});

describe('server > data-sources > UserDataSource > listItems', () => {
	test('If no arguments were passed, listItems show return all users', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "scan" command will succeed and return the list of all users, which, in this case, is composed of only 1 (mockUserModel)
		mocked(mockDocClient.scan as DocumentClientScanType).mockImplementation(
			(_params: ScanInput, callback: (error: AWSError | null, data: DocumentClient.ScanOutput) => void) => {
				callback(null, { Items: [mockUserModel], Count: 1, ScannedCount: 1 });
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		// ----- Act -----
		const output = await userDataSource.listItems();

		// ----- Assert -----
		expect(output).toBeDefined();
		expect(output.items).toBeDefined();
		expect(output.items.length).toEqual(1);
		expect(output.items[0]).toEqual(mockUserModel);
	});

	test('If the response from "scan" command is not valid, for any reason, listItems should throw exception indicating it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "scan" command will return an object which contains the items, but does not contain properties "Count" and "ScannedCount"
		mocked(mockDocClient.scan as DocumentClientScanType).mockImplementation(
			(_params: ScanInput, callback: (error: AWSError | null, data: DocumentClient.ScanOutput) => void) => {
				callback(null, { Items: [mockUserModel] /*"Count" and "ScannedCount" missing*/ });
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(1);

		try {
			// ----- Act -----
			// this time we are passing arguments to listItems so that we can exercise some branches inside it
			await userDataSource.listItems({ exclusiveStartId: mockUserModel.id, limit: 5 }, mockUserModel.name);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.INVALID_SCAN_RESPONSE);
		}
	});

	test('An error from DynamoDB should make listItems throw exception telling that the "scan" command failed', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		const mockAwsErrorCode = 'ResourceNotFoundException';
		// in this mock, "scan" command will fail and return the error
		mocked(mockDocClient.scan as DocumentClientScanType).mockImplementation(
			(_params: ScanInput, callback: (error: AWSError | null, data: DocumentClient.ScanOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'Requested resource not found',
						code: mockAwsErrorCode,
						name: mockAwsErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.listItems();
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.LIST_USERS_FAILED);
			expect(error.code).toMatch(mockAwsErrorCode);
		}
	});
});

describe('server > data-sources > UserDataSource > putItem', () => {
	test('If a simple UserCreationInput is passed to putItem, it should return the created user', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "put" command will succeed and return empty values, as it uses to when the operation completes
		mocked(mockDocClient.put as DocumentClientPutType).mockImplementation(
			(_params: PutItemInput, callback: (error: AWSError | null, data: DocumentClient.PutItemOutput) => void) => {
				callback(null, {});
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		// ----- Act -----
		const userModel = await userDataSource.putItem(mockCreationModel);

		// ----- Assert -----
		expect(userModel).toBeDefined();
		expect(userModel.name).toEqual(mockCreationModel.name);
		expect(userModel.dob).toEqual(mockCreationModel.dob);
		expect(userModel.id).toBeDefined();
		expect(userModel.createdAt).toBeDefined(); // TODO: check creation date
		expect(userModel.updatedAt).toBeDefined(); // TODO: check update date
	});

	test('An error from DynamoDB should make putItem throw exception telling that the "put" command failed', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		const mockAwsErrorCode = 'ResourceNotFoundException';
		// in this mock, "put" command will fail and return the error
		mocked(mockDocClient.put as DocumentClientPutType).mockImplementation(
			(_params: PutItemInput, callback: (error: AWSError | null, data: DocumentClient.PutItemOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'Requested resource not found',
						code: mockAwsErrorCode,
						name: mockAwsErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.putItem(mockCreationModel);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.PUT_USER_FAILED);
			expect(error.code).toMatch(mockAwsErrorCode);
		}
	});
});

describe('server > data-sources > UserDataSource > updateItem', () => {
	test('If a simple UserUpdateInput is passed and the user exists, it should update the user and return it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "update" command will succeed and return the new user model
		mocked(mockDocClient.update as DocumentClientUpdateType).mockImplementation(
			(_params: UpdateItemInput, callback: (error: AWSError | null, data: DocumentClient.UpdateItemOutput) => void) => {
				callback(null, { Attributes: { ...mockUserModel, ...mockUpdateModel, updatedAt: new Date().toUTCString() } });
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		// ----- Act -----
		const userModel = await userDataSource.updateItem(mockUserModel.id, { ...mockUpdateModel, name: undefined });

		// ----- Assert -----
		expect(userModel).toBeDefined();
		expect(userModel.id).toEqual(mockUserModel.id);
		expect(userModel.name).toEqual(mockUserModel.name);
		expect(userModel.dob).not.toEqual(mockUserModel.dob);
		expect(userModel.dob).toEqual(mockUpdateModel.dob);
		expect(userModel.updatedAt).not.toEqual(userModel.createdAt);
	});

	test('If an ID of a non-existent user is passed to updateItem, it should throw exception indicating it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, conditional check of the "update" command will fail and the error object will be returned
		mocked(mockDocClient.update as DocumentClientUpdateType).mockImplementation(
			(_params: UpdateItemInput, callback: (error: AWSError | null, data: DocumentClient.UpdateItemOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'The conditional request failed',
						code: conditionalCheckFailedErrorCode,
						name: conditionalCheckFailedErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.updateItem(mockUserModel.id, mockUpdateModel);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.USER_NOT_FOUND);
			expect(error.code).toMatch(conditionalCheckFailedErrorCode);
		}
	});

	test('An error from DynamoDB should make updateItem throw exception telling that the "update" command failed', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		const mockAwsErrorCode = 'ResourceNotFoundException';
		// in this mock, "update" command will fail and return the error object
		mocked(mockDocClient.update as DocumentClientUpdateType).mockImplementation(
			(_params: UpdateItemInput, callback: (error: AWSError | null, data: DocumentClient.UpdateItemOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'Requested resource not found',
						code: mockAwsErrorCode,
						name: mockAwsErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.updateItem(mockUserModel.id, mockUpdateModel);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.UPDATE_USER_FAILED);
			expect(error.code).toMatch(mockAwsErrorCode);
		}
	});
});

describe('server > data-sources > UserDataSource > deleteItem', () => {
	test('If an ID of an existing user is passed to deleteItem, it should delete this user and return it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "delete" command will succeed and return the mock user model was deleted
		mocked(mockDocClient.delete as DocumentClientDeleteType).mockImplementation(
			(_params: DeleteItemInput, callback: (error: AWSError | null, data: DocumentClient.DeleteItemOutput) => void) => {
				callback(null, { Attributes: mockUserModel });
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		// ----- Act -----
		const userModel = await userDataSource.deleteItem(mockUserModel.id);

		// ----- Assert -----
		expect(userModel).toBeDefined();
		expect(userModel).toEqual(mockUserModel);
	});

	test('If an ID of a non-existent user is passed to deleteItem, it should throw exception indicating it', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		// in this mock, "delete" command will return an empty object since it did not find the user to delete
		mocked(mockDocClient.delete as DocumentClientDeleteType).mockImplementation(
			(_params: DeleteItemInput, callback: (error: AWSError | null, data: DocumentClient.DeleteItemOutput) => void) => {
				callback(null, {});
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(1);

		try {
			// ----- Act -----
			await userDataSource.deleteItem(mockUserModel.id);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.USER_NOT_FOUND);
		}
	});

	test('An error from DynamoDB should make deleteItem throw exception telling that the "delete" command failed', async () => {
		// ----- Arrange -----
		const mockDocClient = new DocumentClient();
		const mockAwsErrorCode = 'ResourceNotFoundException';
		// in this mock, "delete" command will fail and return the error object
		mocked(mockDocClient.delete as DocumentClientDeleteType).mockImplementation(
			(_params: DeleteItemInput, callback: (error: AWSError | null, data: DocumentClient.DeleteItemOutput) => void) => {
				callback(
					{
						statusCode: 400,
						message: 'Requested resource not found',
						code: mockAwsErrorCode,
						name: mockAwsErrorCode,
						time: new Date(),
					},
					{},
				);
			},
		);
		const userDataSource = new UserDataSource(mockDocClient);

		expect.assertions(2);

		try {
			// ----- Act -----
			await userDataSource.deleteItem(mockUserModel.id);
		} catch (error) {
			// ----- Assert -----
			expect(error.extensions?.code).toMatch(ErrorCodes.DELETE_USER_FAILED);
			expect(error.code).toMatch(mockAwsErrorCode);
		}
	});
});
