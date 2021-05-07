import AWS from 'aws-sdk';

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

export const dbClient = new AWS.DynamoDB.DocumentClient(options);

