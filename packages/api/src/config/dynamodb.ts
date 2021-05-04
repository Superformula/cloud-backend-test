import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const isOffline = process.env.IS_OFFLINE;
const isTest = process.env.JEST_WORKER_ID;
// use serverless-dynamodb endpoint in offline mode
export const dynamodbClientOption = isOffline || isTest
  ? {
    endpoint: 'http://localhost:8100',
  }
  : {};

export const dynamoDbClient = new DocumentClient(dynamodbClientOption);
