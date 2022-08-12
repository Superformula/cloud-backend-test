import express from 'express';
import server from './src';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';
import conf from './src/conf';
// import { Handler } from '@aws-cdk/aws-lambda';

export const jwtCheck = jwt({
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

export const handler = server.createHandler({
  expressAppFromMiddleware(middleware) {
    const app = express();
    // app.use(log);
    app.use(cors());
    app.use(jwtCheck);
    app.use(middleware);
    return app;
  },
  expressGetMiddlewareOptions: { path: '/graphql' },
});
