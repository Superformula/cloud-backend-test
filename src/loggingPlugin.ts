import { GraphQLRequestContext } from 'apollo-server-core';
// import cuid from 'cuid';
import { GraphQLError } from 'graphql';
// import pino from 'pino';

export const loggingPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line require-await
  async requestDidStart(requestContext: GraphQLRequestContext) {
    console.log('Request started! Query:\n' + requestContext.request.query);
    // requestContext.logger = pino().child({ requestId: cuid() });
    // requestContext.logger.info({
    //   operationName: requestContext.request.operationName,
    //   query: requestContext.request.query,
    //   variables: requestContext.request.variables,
    // });
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      // eslint-disable-next-line require-await
      async parsingDidStart(requestContext: GraphQLRequestContext) {
        console.log(
          'Parsing started! variables:\n',
          requestContext.request.variables
        );
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      // eslint-disable-next-line require-await
      async validationDidStart(requestContext: GraphQLRequestContext) {
        console.log('Validation started! context:\n', requestContext.context);
      },

      // The didEncounterErrors event fires when Apollo Server encounters errors
      // while parsing, validating, or executing a GraphQL operation
      // async didEncounterErrors({
      //   logger,
      //   errors,
      // }: {
      //   logger: GraphQLRequestContext['logger'];
      //   errors: ReadonlyArray<GraphQLError>;
      // }) {
      //   await errors.forEach((error: GraphQLError) => logger.warn(error));
      // },
    };
  },
};
