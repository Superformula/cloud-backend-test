import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { execute, toPromise } from 'apollo-link';
import { ApolloServer } from 'apollo-server-lambda';
import { GeoDataSource } from '../graphql/dataSources/geo/GeoDataSource';
import { StorageDataSource } from '../graphql/dataSources/storage/StorageDataSource';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas/schemas';

module.exports.toPromise = toPromise;

export const mockedContext = {
    geoClient: {
      forwardGeocode: jest.fn()
    },
    db: {
      scan: jest.fn(),
      put:  jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
};

/**
 * Integration testing utils
 */
export const constructTestServer = () => {
  const geoDataStorage = new GeoDataSource(mockedContext.geoClient);
  const storeDataStorage = new StorageDataSource(mockedContext.db);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ event, context }) => ({
      dataSources: {
          storage: storeDataStorage,
          geo: geoDataStorage
      },
      event,
      ...context,
    }),
  });

  return { server, geoDataStorage, storeDataStorage };
};

// module.exports.constructTestServer = constructTestServer;

/**
 * e2e Testing Utils
 */

export const startTestServer = async server => {

  const httpServer = await server.listen({ port: 0 });

  const link = new HttpLink({
    uri: `http://localhost:${httpServer.port}`,
    fetch,
  });

  const executeOperation = ({ query, variables = {} }) =>
    execute(link, { query, variables });

  return {
    link,
    stop: () => httpServer.server.close(),
    graphql: executeOperation,
  };
};

// module.exports.startTestServer = startTestServer;
