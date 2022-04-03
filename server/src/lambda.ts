import Geocoding, { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';
import { ApolloServer } from 'apollo-server-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { Mutation } from './graphql/resolvers/mutation';
import { Query } from './graphql/resolvers/query';
import { MapboxService } from './modules/location/mapbox.service';
import { UserService } from './modules/user/user.service';
import { AppContext } from './types/types';

// Setup dotenv to read env vars
config();

// Read types from .graphql schema
const typeDefs = readFileSync('./graphql/schema/schema.graphql', 'utf8');

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Mutation,
    Query,
  },
  context: (): AppContext => {
    // Create instance of DynamoDB document client
    const dynamo = new DocumentClient();
    // Get table name from env vars
    const tableName = process.env.USER_TABLE_NAME ?? '';
    // Create instance of user service
    const userService = new UserService(dynamo, tableName);

    // Get mapbox api key from env vars
    const mapboxApiKey = process.env.MAPBOX_API_KEY ?? '';
    // Instance geocodeService
    const geolocation: GeocodeService = Geocoding({
      accessToken: mapboxApiKey,
    });
    // Instance mapboxService
    const locationService = new MapboxService(geolocation);

    return { userService, locationService };
  },
});

exports.graphqlHandler = server.createHandler();
