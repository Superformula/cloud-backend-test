import {
  envelop,
  useLogger,
  useSchema,
  useTiming,
} from '@envelop/core';
import {
  ExecutionContext,
  FormatPayloadParams,
  getGraphQLParameters,
  processRequest,
  Request,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import {
  Context,
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
} from 'aws-lambda';
import { GraphQLSchema } from 'graphql';
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from '@graphql-tools/schema';
import SecretsManager from 'aws-sdk/clients/secretsmanager';

type HandlerConfig<C> = {
  formatPayload?: (params: FormatPayloadParams<C, any>) => any;
  context?: (request: {
    event: APIGatewayProxyEventV2;
    context: Context;
    execution: ExecutionContext;
  }) => Promise<C>;
} & (
  | { schema: GraphQLSchema }
  | {
      resolvers: IExecutableSchemaDefinition<C>['resolvers'];
      typeDefs: IExecutableSchemaDefinition<C>['typeDefs'];
    }
);

/**
 * createGQLHandler
 *
 * @param {HandlerConfig<T>} config
 * @return {APIGatewayProxyHandlerV2<never>}
 */
export function createGQLHandler<T>(
  config: HandlerConfig<T>,
): APIGatewayProxyHandlerV2<never> {
  const rawSchema =
    'schema' in config ?
      config.schema :
      makeExecutableSchema({
        typeDefs: config.typeDefs,
        resolvers: config.resolvers,
      });

  const plugins = [
    useSchema(rawSchema),
    useLogger(),
    useTiming(),
  ];

  const getEnveloped = envelop({
    plugins,
  });

  /**
   * The Lambda handler for the GraphQL API
   *
   * @param {APIGatewayProxyEventV2} event
   * @param {Context} context
   * @return {APIGatewayProxyHandlerV2<never>}
   */
  const handler: APIGatewayProxyHandlerV2<never> = async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ) => {
    // NOTE: Only query Secrets Manager if the
    // MAPBOX_API_KEY environment variable is not set.
    if (!process.env.MAPBOX_API_KEY) {
      const secretsManager = new SecretsManager({ apiVersion: '2017-10-17' });
      const params = {
        SecretId: process.env.GEOCODER_API_KEYS_SECRETS_NAME ||
          'GeocoderApiKeys',
      };
      const secrets = await secretsManager.getSecretValue(
        params,
      ).promise().then(
        (data) => JSON.parse(data?.SecretString as string),
      );
      process.env.MAPBOX_API_KEY = `${secrets['MAPBOX_API_KEY']}`;
    }

    const {
      parse,
      validate,
      contextFactory,
      execute,
      schema,
    } = getEnveloped({ event, context });
    const request: Request = {
      body: event.body ? JSON.parse(event.body) : undefined,
      query: event.queryStringParameters,
      method: event.requestContext.http.method,
      headers: event.headers,
    };

    if (shouldRenderGraphiQL(request)) {
      return {
        statusCode: 302,
        headers: { // eslint-disable-next-line max-len
          Location: `https://studio.apollographql.com/sandbox/explorer?endpoint=https://${event.requestContext.domainName}`,
        },
      };
    }
    const { operationName, query, variables } = getGraphQLParameters(request);

    // NOTE: Validate and execute the query
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      parse,
      validate,
      execute,
      contextFactory,
      formatPayload: config.formatPayload as any,
    });
    if (result.type === 'RESPONSE') {
      return {
        statusCode: result.status,
        body: JSON.stringify(result.payload),
        headers: Object.fromEntries(
          result.headers.map((h) => [ h.name, h.value ]),
        ),
      };
    }
    return {
      statusCode: 500,
    };
  };

  return handler;
}
