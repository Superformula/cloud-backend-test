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
  debug: false,
  context: expressContextBuilder,
  // nodeEnv: process.env.NODE_ENV, can be set to developement or prd
  // context: expressContextBuilder,
  // plugins: [useLogger({ logFn: () => logger })],
  dataSources,
});

console.log(`Server ready at http://localhost:${conf.server.port}/graphql!`);
export default server;
