import * as dotenv from 'dotenv';
dotenv.config();
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typedefs';
import { resolvers } from './resolvers/coordinates';
import conf from './conf';
import { ApolloServer } from 'apollo-server-lambda';
import { loggingPlugin } from './loggingPlugin';
import { hiveApollo } from '@graphql-hive/client';

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
  // nodeEnv: process.env.NODE_ENV, can be set to developement or prd
  // context: expressContextBuilder,
  // plugins: [useLogger({ logFn: () => logger })],
});

console.log(`Server ready at http://localhost:${conf.server.port}/graphql!`);
export default server;
