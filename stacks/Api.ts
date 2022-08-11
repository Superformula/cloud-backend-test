import {
  StackContext,
  Api as ApiGateway,
  ApiAuthorizer,
} from '@serverless-stack/resources';
import {
  aws_secretsmanager as secretsManager,
  Duration,
} from 'aws-cdk-lib';
import {
  IGrantable,
} from 'aws-cdk-lib/aws-iam';

/**
 * The GraphQL API Stack
 *
 * @param {StackContext} context
 * @return {ApiGateway<Record<string, ApiAuthorizer>>}
 */
export function Api(
  { app, stack }: StackContext,
): ApiGateway<Record<string, ApiAuthorizer>> {
  // NOTE: see cdk.context.json for the name of the secret in
  // AWS Secrets Manager.
  const geocoderApiKeysSecretsName = app.node.tryGetContext(
    'geocoderApiKeysSecretsName',
  ) || 'GeocoderApiKeys';

  const secret = secretsManager.Secret.fromSecretNameV2(
    stack,
    'ApiKeys',
    geocoderApiKeysSecretsName,
  );

  const api = new ApiGateway(
    stack,
    'api',
    {
      defaults: {
        function: {
          environment: {
            GEOCODER_API_KEYS_SECRETS_NAME: geocoderApiKeysSecretsName,
          },
        },
      },
      routes: {
        'POST /graphql': {
          type: 'pothos',
          function: {
            handler: process.env.VITEST_POOL_ID ?
              './services/functions/graphql/graphql.handler' :
              'functions/graphql/graphql.handler',
            memorySize: 192,
            retryAttempts: 0,
            timeout: 10,
            maxEventAge: Duration.minutes(1),
          },
          schema: './services/functions/graphql/schema.ts',
          output: 'graphql/schema.graphql',
          commands: [ // eslint-disable-next-line max-len
            'npx genql --output ./graphql/genql --schema ./graphql/schema.graphql --esm',
          ],
        },
      },
    },
  );

  if (
    api.getFunction('POST /graphql') &&
    api.getFunction('POST /graphql')?.role
  ) { // NOTE: grant read access to API keys in AWS Secrets Manager
    secret.grantRead(api.getFunction('POST /graphql')?.role as IGrantable);
  }

  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
