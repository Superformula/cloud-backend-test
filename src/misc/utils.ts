import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuidv4 } from 'uuid';

// this function iterates over input's keys and build a UpdateItemInput from it
export function buildSimpleUpdateItemInput(
	tableName: string,
	id: string,
	input: DocumentClient.ExpressionAttributeValueMap,
): DocumentClient.UpdateItemInput {
	const expressionAttributeNames: DocumentClient.ExpressionAttributeNameMap = {};
	const expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = {};
	const updateExpressionFragments: string[] = [];

	for (const key in input) {
		// using uuids (without hyphen) to make the attribute name unique, in order to avoid reserved DynamoDB reserved words (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
		const uniqueAttributeName = `#${uuidv4().replace(/-/g, '')}`;
		expressionAttributeNames[uniqueAttributeName] = key;
		expressionAttributeValues[`:${key}`] = input[key];
		updateExpressionFragments.push(`${uniqueAttributeName} = :${key}`);
	}

	// build the expression that will be used to describe the update operation in the table, using the fragments that we got above
	const updateExpression = `set ${updateExpressionFragments.join(', ')}`;

	// add ID as attribute value so that we can use in the condition expression
	expressionAttributeValues[':id'] = id;

	return {
		TableName: tableName,
		Key: { id },
		ExpressionAttributeNames: expressionAttributeNames,
		ExpressionAttributeValues: expressionAttributeValues,
		UpdateExpression: updateExpression,
		ConditionExpression: 'id = :id', // only update if the item already exists in the DB,
	};
}
