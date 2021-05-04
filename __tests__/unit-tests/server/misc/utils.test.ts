import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildSimpleUpdateItemInput } from '../../../../src/server/misc/utils';
import {} from 'uuid';

const mockUuid = 'f30692ca-48b9-4a2f-be35-dfd8c98e5662';
const mockProcessedUuid = `#${mockUuid.replace(/-/g, '')}`;
const mockTableName = 'Users';
const mockUserName = 'Bobby';
const mockUserId = '12345';

// Mocking uuid to return always the same mock uuid
jest.mock('uuid', () => {
	return {
		v4: jest.fn(() => mockUuid),
	};
});

describe('server > misc > utils > buildSimpleUpdateItemInput', () => {
	test('A simple input should return an expected result', async () => {
		// ----- Arrange -----
		const mockUpdateItemInput: DocumentClient.UpdateItemInput = {
			TableName: mockTableName,
			Key: { id: mockUserId },
			ExpressionAttributeNames: {
				[mockProcessedUuid]: 'name',
			},
			ExpressionAttributeValues: {
				':name': mockUserName,
				':id': mockUserId,
			},
			UpdateExpression: `set ${mockProcessedUuid} = :name`,
			ConditionExpression: 'id = :id',
		};

		// ----- Act -----
		const updateItemInput = buildSimpleUpdateItemInput(mockTableName, mockUserId, {
			name: mockUserName,
			unusedProp: undefined,
		});

		// ----- Assert -----
		expect(updateItemInput).toEqual(mockUpdateItemInput);
	});
});
