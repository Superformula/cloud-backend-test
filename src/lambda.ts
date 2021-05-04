import { ApolloServer } from 'apollo-server-lambda';
import { Query } from './graphql/resolvers/query';
import { Mutation } from './graphql/resolvers/mutation';
import { typeDefs } from './graphql/schema/schema';
import dotenv from 'dotenv';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBUserRepository } from './data-access/repositories/user-repository';
import { Context } from './graphql/types/context';
import { MapboxGeolocationRepository } from './data-access/repositories/geolocation-repository';
import { configureUsersDB } from './configuration/users-db';
import { configureMapbox } from './configuration/mapbox';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding';
dotenv.config();

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query,
		Mutation,
	},
	playground: {
		endpoint: `/${process.env.STAGE_NAME || 'dev'}/graphql`,
	},
	context: (): Context => {
		// This client initialization here ensure we are using the same instance of this client through all our resolvers in this request.
		// We don't want to declare too many of our dependencies in this way since it might slow down our requests
		// with dependencies that would not be used for a particular resolver, maybe use a IOC container to better handle this?
		const documentClient = new DocumentClient();
		const usersDBConfig = configureUsersDB();
		const userRepository = new DynamoDBUserRepository(documentClient, usersDBConfig);

		const mapboxConfig = configureMapbox();
		const geocodingClient = Geocoding({
			accessToken: mapboxConfig.accessToken,
		});
		const geolocationRepository = new MapboxGeolocationRepository(geocodingClient);

		return { userRepository, geolocationRepository };
	},
});

exports.graphqlHandler = server.createHandler();
