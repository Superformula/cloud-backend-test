import Axios from 'axios';
import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
chai.use(chaiShallowDeepEqual);
import * as dotenv from 'dotenv';
dotenv.config();
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from '../../resolvers/coordinates';
import { typeDefs } from '../../typedefs';
import { jwkPublicGood, makeJwtToken } from '../utilities/jwt';
import JWTMocker from '../utilities/jwt.mocks';
import checkResult from '../utilities/checkResult';
import C from '../utilities/testData';
import { expressContextBuilder } from '../../expressContextBuilder';
import { jwtCheck } from '../../../handler';
import { dataSources } from '../..';

const expect = chai.expect;

const port = 4000;
const request = Axios.create({
  baseURL: `http://localhost:4000`,
  validateStatus: function (status) {
    return status <= 500; // Reject only if the status code is greater than 500
  },
});

describe('End-to-End tests for GraphQL operations', () => {
  let jwtMocker: JWTMocker;
  let server: ApolloServer<ExpressContext>;
  before(() => {
    jwtMocker = new JWTMocker();
    const app = express();
    app.use(cors());
    app.use(jwtCheck);
    app.use(function (err: any, req: any, res: any, next: any) {
      if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ message: err.message });
        return;
      }
      next();
    });
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    server = new ApolloServer({
      schema,
      context: expressContextBuilder,
      dataSources: dataSources,
    });

    app.listen({ port }, async () => {
      await server.start();
      server.applyMiddleware({ app, path: '/graphql' });
      console.log(`Server ready at http://localhost:${port}/graphql!`);
    });
  });
  afterEach(() => {
    jwtMocker.clearMocks();
  });
  after(async () => {
    await server?.stop();
  });

  it('should be able to return results', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: { name: C.ADDRESS },
    };

    jwtMocker.getJWKS(200, jwkPublicGood);
    const jwtToken = makeJwtToken({});
    const response = await request.post('/graphql', queryData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    checkResult(response, 200, {
      data: {
        address: { longitude: -71.18494799999999, latitude: 42.366192 },
      },
    });
  });

  it('should be able to handle error for bad address', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: { name: '213' },
    };

    jwtMocker.getJWKS(200, jwkPublicGood);
    const jwtToken = makeJwtToken({});
    const response = await request.post('/graphql', queryData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    expect(response.data.errors[0].message).to.equal(
      'Please provide valid address!'
    );
  });

  it('should be able to handle error for numeric address', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: { name: 213 },
    };

    jwtMocker.getJWKS(200, jwkPublicGood);
    const jwtToken = makeJwtToken({});
    const response = await request.post('/graphql', queryData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    expect(response.data.errors?.[0].extensions).to.shallowDeepEqual({
      code: C.GRAPHQL_ERRORS.BAD_USER_INPUT,
    });
  });

  it('should be able to handle error with out address', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: {},
    };

    jwtMocker.getJWKS(200, jwkPublicGood);
    const jwtToken = makeJwtToken({});
    const response = await request.post('/graphql', queryData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    expect(response.data.errors[0].message).to.equal(
      'Variable "$name" of required type "String!" was not provided.'
    );
  });

  it('should not be able to return results for a bad token', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: { name: C.ADDRESS },
    };

    jwtMocker.getJWKS(200, jwkPublicGood);
    const jwtToken = '';

    const response = await request.post('/graphql', queryData, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    expect(response.status).to.equal(401);
    expect(response.data.message).to.equal(
      'Format is Authorization: Bearer [token]'
    );
  });

  it('should not be able to return results for no token', async () => {
    const queryData = {
      query: `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`,
      variables: { name: C.ADDRESS },
    };

    jwtMocker.getJWKS(200, jwkPublicGood);

    const response = await request.post('/graphql', queryData, {
      headers: { },
    });
    expect(response.status).to.equal(401);
    expect(response.data.message).to.equal(
      'No authorization token was found'
    );
  });
});
