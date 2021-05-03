import { ApolloServer } from 'apollo-server-lambda';
import { apolloServerConfig } from './misc/apollo-server-config';

const server = new ApolloServer(apolloServerConfig);
export const handler = server.createHandler();
