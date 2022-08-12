import { ApolloServer, ServerInfo } from 'apollo-server';
import { resolvers } from '../../resolvers/coordiantes';
import { typeDefs } from '../../typedefs';

// This function will create a new server Apollo Server instance
export const createApolloServer = async (options = { port: 4000 }) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const serverInfo: ServerInfo = await server.listen(options);
  if (process.env.NODE_ENV !== 'test') {
    console.log(
      `🚀 Query end point ready at http://localhost:${options.port}${server.graphqlPath}`
    );
  }

  // serverInfo is an object containing the server instance and the url the server is listening on
  return serverInfo;
};
