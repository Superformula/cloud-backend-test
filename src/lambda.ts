import { ApolloServer } from 'apollo-server-lambda';
import { DocumentNode } from 'graphql';
import { GraphQLFileLoader, loadDocumentsSync } from 'graphql-tools';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';

// TODO: This way we might be able to load multiple schema files. Test this later.
const sources = loadDocumentsSync('./graphql/schema/schema.graphql', {
	loaders: [new GraphQLFileLoader()],
});

const server = new ApolloServer({
	typeDefs: sources.map((s) => s.document as DocumentNode),
	resolvers: {
		Query,
		Mutation,
	},
});

exports.graphqlHandler = server.createHandler();
