import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { resolvers } from '../../resolvers/coordinates';
import { typeDefs } from '../../typedefs';
import C from '../utilities/testData';

chai.use(chaiShallowDeepEqual);

const expect = chai.expect;

describe('Integration tests for GraphQL operations', () => {
  let testServer: ApolloServer<ExpressContext>;
  before(() => {
    testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
  });
  after(async () => {
    await testServer?.stop();
  });
  it('should be able to return results', async () => {
    const result = await testServer.executeOperation({
      query: `query Address($addressId: ID!) {
        address(id: $addressId) {
            longitude
            latitude
        }
        }`,
      variables: { addressId: C.ADDRESS },
    });
    expect(result.errors).to.not.exist;
    expect(result.data?.address).to.shallowDeepEqual({
      latitude: 42.366192,
      longitude: -71.18494799999999,
    });
  });

  it('should throw error for null address', async () => {
    const result = await testServer.executeOperation({
      query: `query Address($addressId: ID!) {
        address(id: $addressId) {
            longitude
            latitude
        }
        }`,
      variables: { addressId: null },
    });
    expect(result.errors).to.exist;
    expect(result.errors?.[0].extensions).to.shallowDeepEqual({
      code: 'BAD_USER_INPUT',
    });
  });
  it('should not return results for not supported operation', async () => {
    const result = await testServer.executeOperation({
      query: 'query SayHelloWorld($name: String) { hello(name: $name) }',
      variables: { name: 'world' },
    });
    expect(result.errors).to.exist;
    expect(result.errors?.[0].extensions).to.shallowDeepEqual({
      code: 'GRAPHQL_VALIDATION_FAILED',
    });
  });
});