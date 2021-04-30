import { ApolloServer } from 'apollo-server-lambda';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import { typeDefs } from './graphql/schema/schema';

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
	},
});

exports.graphqlHandler = server.createHandler();
