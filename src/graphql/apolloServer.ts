import { ApolloServer, IResolvers } from 'apollo-server-lambda';
import { StorageDataSource } from './dataSources/storage/StorageDataSource';
import resolvers from './resolvers';
import typeDefs from './schemas/schemas';

const NODE_ENV = process.env.NODE_ENV;

const IS_DEV = !NODE_ENV || !['production'].includes(NODE_ENV);

// const resolvers = {
//   Mutation: mutations,
//   Query: queries,
// } as IResolvers;


const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: `${IS_DEV ? `/${NODE_ENV}/` : '/'}graphql`,
  },
  // subscriptions: {},
  introspection: IS_DEV,
  context: ({ event, context }) => ({
    dataSources: {
        storage: new StorageDataSource()
    },
    event,
    context,
    headers: event.headers,
    functionName: context.functionName,
  }),
  tracing: true,
});

export default apolloServer.createHandler();
