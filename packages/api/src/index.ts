import {
  DynamoDBConnectionManager,
  DynamoDBSubscriptionManager,
  DynamoDBEventProcessor,
  Server,
} from 'aws-lambda-graphql';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { dynamoDbClient } from './config';
import { resolvers, typeDefs } from './schemas';

const subscriptionManager = new DynamoDBSubscriptionManager({ dynamoDbClient });
const connectionManager = new DynamoDBConnectionManager({
  apiGatewayManager: process.env.IS_OFFLINE
    ? new ApiGatewayManagementApi({
        endpoint: 'http://localhost:3001',
      })
    : undefined,
  dynamoDbClient,
  subscriptions: subscriptionManager,
});

const server = new Server({
  connectionManager,
  eventProcessor: new DynamoDBEventProcessor(),
  resolvers,
  subscriptionManager,
  // use serverless-offline endpoint in offline mode
  ...(process.env.IS_OFFLINE
    ? {
        playground: {
          endpoint: 'http://localhost:3000/dev',
          subscriptionEndpoint: 'ws://localhost:3001',
        },
      }
    : {
      // TODO: Replace with deployed api url
    }),
  typeDefs,
});

export const handleHttp = server.createHttpHandler();
export const handleWebSocket = server.createWebSocketHandler();
export const handleDynamoDBStream = server.createEventHandler();
