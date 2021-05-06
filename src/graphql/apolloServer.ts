import { ApolloServer, IResolvers } from 'apollo-server-lambda';
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
    event,
    context,
    headers: event.headers,
    functionName: context.functionName,
  }),
  tracing: true,
});

export default apolloServer.createHandler();
