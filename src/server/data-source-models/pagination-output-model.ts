import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export type PaginationOutputModel<T> = {
	items: T[];
	count: number;
	scannedCount: number;
	lastEvaluatedKey?: DocumentClient.Key;
};

export default PaginationOutputModel;
