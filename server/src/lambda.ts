import { ApolloServer } from 'apollo-server-lambda';
import { resolvers } from './graphql/resolvers/resolvers';
import { typeDefs } from './graphql/schema/schema';

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler();
