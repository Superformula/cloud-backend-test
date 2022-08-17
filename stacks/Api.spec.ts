import {
  describe,
  it,
  vi,
  afterEach,
} from 'vitest';
import { App, getStack } from '@serverless-stack/resources';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Api } from './Api';


describe('API stack', () => {
  afterEach(
    () => {
      vi.restoreAllMocks();
    },
  );
  it('Essential resources exists', async () => {
    const app = new App();
    app.stack(Api);
    const template = Template.fromStack(getStack(Api));
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.resourceCountIs('AWS::ApiGatewayV2::Integration', 1);
    template.resourceCountIs('AWS::Lambda::Permission', 1);
    template.resourceCountIs('AWS::ApiGatewayV2::Route', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);
  });
  it('GraphQL Lambda function properties', async () => {
    const app = new App();
    app.stack(Api);
    const template = Template.fromStack(getStack(Api));
    template.hasResourceProperties(
      'AWS::Lambda::Function',
      Match.objectEquals(
        {
          'Code': {
            'S3Bucket': Match.anyValue(),
            'S3Key': Match.anyValue(),
          },
          'Role': {
            'Fn::GetAtt': [
              'apiLambdaPOSTgraphqlServiceRole528A98B5',
              'Arn',
            ],
          },
          'Environment': {
            'Variables': {
              'GEOCODER_API_KEYS_SECRETS_NAME': 'GeocoderApiKeys',
              'AWS_NODEJS_CONNECTION_REUSE_ENABLED': '1',
              'SST_APP': Match.anyValue(),
              'SST_STAGE': Match.anyValue(),
            },
          },
          'EphemeralStorage': {
            'Size': 512,
          },
          'Handler': 'services/functions/graphql/graphql.handler',
          'MemorySize': 192,
          'Runtime': 'nodejs14.x',
          'Tags': [
            {
              'Key': 'sst:app',
              'Value': Match.anyValue(),
            },
            {
              'Key': 'sst:stage',
              'Value': Match.anyValue(),
            },
          ],
          'Timeout': 10,
          'TracingConfig': {
            'Mode': 'Active',
          },
        },
      ),
    );
  });
  it('GraphQL Lambda function IAM policy properties', async () => {
    const app = new App();
    app.stack(Api);
    const template = Template.fromStack(getStack(Api));
    template.hasResourceProperties(
      'AWS::IAM::Policy',
      Match.objectEquals({
        'PolicyDocument': {
          'Statement': [
            {
              'Action': [
                'xray:PutTraceSegments',
                'xray:PutTelemetryRecords',
              ],
              'Effect': 'Allow',
              'Resource': '*',
            },
            {
              'Action': [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret',
              ],
              'Effect': 'Allow',
              'Resource': {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    }, // eslint-disable-next-line max-len
                    ':secretsmanager:us-east-1:my-account:secret:GeocoderApiKeys-??????',
                  ],
                ],
              },
            },
          ],
          'Version': '2012-10-17',
        },
        'PolicyName': 'apiLambdaPOSTgraphqlServiceRoleDefaultPolicyD2B7D30E',
        'Roles': [
          {
            'Ref': 'apiLambdaPOSTgraphqlServiceRole528A98B5',
          },
        ],
      }),
    );
  });
});
