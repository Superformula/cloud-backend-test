import { ApolloServer } from 'apollo-server-lambda';
import { readFileSync } from 'fs';
import { resolvers } from './graphql/resolvers/resolvers';

// Read types from .graphql schema
const typeDefs = readFileSync('./graphql/schema/schema.graphql', 'utf8');

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();
