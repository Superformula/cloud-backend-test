import { createApolloServer } from '../utilities/createApolloServer';
import Axios from 'axios';
import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import http from 'http';
import checkResult from '../utilities/checkResult';
import C from '../utilities/testData';
chai.use(chaiShallowDeepEqual);

describe('End-to-End tests for GraphQL operations', () => {
  let server: http.Server, url: string;

  // before the tests we will spin up a new Apollo Server
  before(async () => {
    // Note we must wrap our object destructuring in parentheses because we already declared these variables
    // We pass in the port as 0 to let the server pick its own ephemeral port for testing
    ({ server, url } = await createApolloServer({ port: 0 }));
  });

  // after the tests we will stop our server
  after(async () => {
    await server?.close();
  });
  it('should be able to return coordinates results', async () => {
    const queryData = {
      query: `query Address($name: String!) {
          address(name: $name) {
              longitude
              latitude
          }
        }`,
      variables: { name: C.ADDRESS },
    };
    const request = Axios.create({
      baseURL: url,
      validateStatus: function (status) {
        return status <= 500; // Reject only if the status code is greater than 500
      },
    });
    const response = await request.post('/', queryData);
    checkResult(response, 200, {
      data: {
        address: { longitude: '-71.18494799999999', latitude: '42.366192' },
      },
    });
  });
});
