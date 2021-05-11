import { GraphQLError, separateOperations, buildSchema, print } from 'graphql'
import { ApolloServer, ApolloError } from 'apollo-server-express'
import resolverTypeDefs from '@/features'
import { formatError } from '@/common/base.graphql'
import depthLimit from 'graphql-depth-limit'
import {
  simpleEstimator,
  fieldExtensionsEstimator,
  getComplexity
} from 'graphql-query-complexity'
import { graphqlUploadExpress } from 'graphql-upload'

export default async ({ app }) => {
  const { resolvers, typeDefs } = await resolverTypeDefs()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const MAX_COMPLEXITY = 100
            const complexity = getComplexity({
              schema: buildSchema(print(typeDefs)),
              query: request.operationName
                ? separateOperations(document)[request.operationName]
                : document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({
                  defaultComplexity: 1
                })
              ]
            })

            if (complexity >= MAX_COMPLEXITY) {
              throw new GraphQLError(
                `Sorry, too complicated query! ${complexity} is over ${MAX_COMPLEXITY} that is the max allowed complexity.`
              )
            }
          },
          didEncounterErrors(ctx) {
            // If we couldn't parse the operation, don't
            // do anything here
            if (!ctx.operation) {
              return
            }

            for (const err of ctx.errors) {
              // Only report internal server errors,
              // all errors extending ApolloError should be user-facing
              if (err instanceof ApolloError) {
                continue
              }
            }
          }
        })
      }
    ],
    uploads: false,
    formatError: (error: GraphQLError): Error => formatError(error),
    introspection: process.env.NODE_ENV !== 'production',
    playground: true,
    validationRules: [depthLimit(4)]
  })

  app.use(graphqlUploadExpress())

  server.applyMiddleware({ app })
}
