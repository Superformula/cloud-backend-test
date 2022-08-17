import * as dotenv from 'dotenv';
dotenv.config();
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typedefs';
import { resolvers } from './resolvers/coordinates';
import conf from './conf';
import { ApolloServer } from 'apollo-server-lambda';
import { loggingPlugin } from './loggingPlugin';
import { hiveApollo } from '@graphql-hive/client';
import { expressContextBuilder } from './expressContextBuilder';
import Coordinates from './dataSources/coordinatesDataSource';
import log from 'lambda-log';

// I like constraints for types like Joi validators, but this module seems not working
// import {
//   constraintDirective,
//   constraintDirectiveTypeDefs,
// } from 'graphql-constraint-directive';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
// schema = constraintDirective()(schema);

export const dataSources = () => {
  return {
    addressSource: new Coordinates(),
  };
};
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  plugins: [
    loggingPlugin,
    hiveApollo({
      enabled: true,
      debug: true, // or false
      token: conf.hiveToken,
      usage: true, // or { ... usage options }
    }),
  ],
  // formatError: (err) => {
  //   // Don't give the specific errors to the client.
  //   log.error(`err in formatError: ${err}`);
  //   if (err.message.startsWith('Database Error: ')) {
  //     return new Error('Internal server error');
  //   }
  //   // Otherwise return the original error. The error can also
  //   // be manipulated in other ways, as long as it's returned.
  //   return err;
  // },
  debug: false,
  context: expressContextBuilder,
  // nodeEnv: process.env.NODE_ENV, can be set to developement or prd
  // context: expressContextBuilder,
  // plugins: [useLogger({ logFn: () => logger })],
  dataSources,
});

log.info(`Server ready at http://localhost:${conf.server.port}/graphql!`);
export default server;
