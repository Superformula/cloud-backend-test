import { ApolloServer, IResolvers, gql } from 'apollo-server-lambda';

const NODE_ENV = process.env.NODE_ENV;

const IS_DEV = !NODE_ENV || !['production'].includes(NODE_ENV);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

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
