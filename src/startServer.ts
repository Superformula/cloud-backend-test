import * as dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typedefs';
import { resolvers } from './resolvers/coordinates';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';
import conf from './conf';
import { loggingPlugin } from './loggingPlugin';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
app.use(cors());
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${conf.jwtTokens.authority}.well-known/jwks.json`,
  }),
  audience: conf.jwtTokens.audience,
  issuer: conf.jwtTokens.authority,
  algorithms: ['RS256'],
});
app.use(jwtCheck);

const expressContextBuilder = (ctx: ExpressContext) => {
  const token = ctx.req.headers.authorization || '';
  const user = { token };
  if (!user) throw new Error('you must be logged in');
  return { user };
};

const server = new ApolloServer({
  schema,
  context: expressContextBuilder,
  csrfPrevention: true,
  plugins: [loggingPlugin],
});

const port = conf.server.port;

app.listen({ port }, async () => {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  console.log(`Server ready at http://localhost:${conf.server.port}/graphql!`);
});

export default server;
