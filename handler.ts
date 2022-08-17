import express from 'express';
import server from './src';
import cors from 'cors';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';
import conf from './src/conf';
import { Handler } from '@aws-cdk/aws-lambda';
import { CreateHandlerOptions } from 'apollo-server-lambda';
import log from 'lambda-log';

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

const handlerOptions: CreateHandlerOptions = {
  expressAppFromMiddleware(middleware) {
    const app = express();
    // app.use(log);
    app.use(cors());
    app.use(jwtCheck);
    app.use(middleware);
    app.use(function (err: any, req: any, res: any, next: any) {
      log.error(`err in express middleware: ${err}`);
      if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ message: err.message });
        return;
      }
      next();
    });
    return app;
  },
  expressGetMiddlewareOptions: { path: '/graphql' },
};
export const handler = server.createHandler(handlerOptions);
