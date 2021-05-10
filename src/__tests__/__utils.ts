import fetch from 'node-fetch';
import { execute, toPromise } from 'apollo-link';
import { ApolloServer } from 'apollo-server-lambda';
import { GeoDataSource } from '../graphql/dataSources/geo/GeoDataSource';
import { StorageDataSource } from '../graphql/dataSources/storage/StorageDataSource';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas/schemas';
import { spawn } from 'child_process';
import cwd from 'cwd';
import { GraphQLClient } from "graphql-request";

export const toPromiseExecution = toPromise;

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

 const localLambdaUrl = 'http://localhost:3000/dev/graphql';

 export const launchLambdaLocally = async () => {
   process.stdout.write('Starting Cloud backend GraphQL servide for e2e tests');
 
   // Run this command in shell.
   // Every argument needs to be a separate string in an an array.
   const command = 'npm';
   const args = [
     'run', 
     'local'
   ];
   const options = { 
     shell: true, 
     cwd: cwd() 
   };
 
   const server = spawn(
     command, 
     args,
     options,
   );
 
   let isUp = false;
   let response, data;
 
   do{
     try{
       response = await fetch(localLambdaUrl);
       data = await response.json();
       isUp = response.status === 403 || response.status === 200;
     }
     catch{
       await new Promise(resolve => setTimeout(resolve, 1000));
     }
     
   
   } while (!isUp);
 
   return Promise.resolve(true);
 }
 
export const teardown = async () => {
   var sh = spawn('bash');
   sh.stdin.write('\x03');
   await sh.kill('SIGINT');
   return Promise.resolve(true);
 
 }

afterAll(async () => {
  await teardown();
});

 export const executeOperastion = async (query: string) : Promise<any> => {
    try{
      const graphQLClient = new GraphQLClient(localLambdaUrl, {
        headers: {
          "x-api-key": "super-formula-api-key-token"
        }
      });

      const result = await graphQLClient.request(query);
      return Promise.resolve(result);
    }
    catch(ex){
      return Promise.resolve(ex);
    }
    


 }