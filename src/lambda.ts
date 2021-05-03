import { ApolloServer } from 'apollo-server-lambda';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import { typeDefs } from './graphql/schema/schema';
import dotenv from 'dotenv';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBUserRepository } from './data-access/repositories/user-repository';
import { Context } from './graphql/types/context';
import { MapboxGeolocationRepository } from './data-access/repositories/geolocation-repository';
dotenv.config();

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
	},
	context: (): Context => {
		// This client initialization here ensure we are using the same instance of this client through all our resolvers.
		// We don't want to declare too many of our dependencies in this way since it might slow down our requests
		// with dependencies that would not be used for a particular resolver, maybe use a IOC container to better handle this?
		const documentClient = new DocumentClient();
		const userRepository = new DynamoDBUserRepository(documentClient);
		const geolocationRepository = new MapboxGeolocationRepository(process.env['MAPBOX_ACCESS_TOKEN']);

		return { userRepository, geolocationRepository };
	},
});

exports.graphqlHandler = server.createHandler();
