import { ApolloServer, ServerInfo } from 'apollo-server';
import { dataSources } from '../..';
import { expressContextBuilder } from '../../expressContextBuilder';
import { resolvers } from '../../resolvers/coordinates';
import { typeDefs } from '../../typedefs';

// This function will create a new server Apollo Server instance
export const createApolloServer = async (options = { port: 4000 }) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: expressContextBuilder,
    dataSources: dataSources,
  });

  const serverInfo: ServerInfo = await server.listen(options);
  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${options.port}${server.graphqlPath}`
    );
  }

  // serverInfo is an object containing the server instance and the url the server is listening on
  return serverInfo;
};
