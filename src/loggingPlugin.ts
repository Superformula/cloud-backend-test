import { GraphQLRequestContext } from 'apollo-server-core';

export const loggingPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  // eslint-disable-next-line require-await
  async requestDidStart(requestContext: GraphQLRequestContext) {
    console.log(
      'Request started! Request Context Query:\n' + requestContext.request.query
    );

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
    };
  },
};
