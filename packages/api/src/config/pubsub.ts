import {
  DynamoDBEventStore,
  PubSub,
} from 'aws-lambda-graphql';
import { dynamoDbClient } from './dynamodb';

const eventStore = new DynamoDBEventStore({ dynamoDbClient });

export const pubSub = new PubSub({ eventStore });
