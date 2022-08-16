import * as chai from 'chai';
import { handler } from '../../../handler';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { makeJwtToken } from '../utilities/jwt';
import { expect } from 'chai';
chai.use(chaiShallowDeepEqual);

const jwtToken = makeJwtToken({});
const event = {
  resource: '/{proxy+}',
  path: '/graphql',
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    Authorization: `Bearer ${jwtToken}`,
    body:
      '{"query":"query Address($name: String!) {\\n    address(name: $name) {\\n        longitude\\n        latitude\\n    }\\n}","variables":{\n' +
      '  "address": "368 lincoln st, waltham, ma 02451"\n' +
      '}}',
  },
  requestContext: {
    resourcePath: '/{proxy+}',
    httpMethod: 'POST',
    path: '/prod/graphql',
    protocol: 'HTTP/1.1',
    stage: 'prod',
    requestTimeEpoch: 1660105760483,
    requestId: '07e519ee-51c6-4eb8-9ec2-57cc7ef08ffd',
  },
};
const context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'GraphQLLambda',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: function (): number {
    throw new Error('Function not implemented.');
  },
  done: function (error?: Error | undefined, result?: any): void {
    throw new Error('Function not implemented.');
  },
  fail: function (error: string | Error): void {
    throw new Error('Function not implemented.');
  },
  succeed: function (messageOrObject: any): void {
    throw new Error('Function not implemented.');
  },
};
describe('Tests for Lambda handler', () => {
  it('should be able to return 401 error if authorization header is missing', async () => {
    const response = await handler(
      event,
      context,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    );
    expect(response.statusCode).to.equal(401);
  });
});
