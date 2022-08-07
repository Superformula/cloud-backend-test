import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

export const setupApolloServer = async (): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [null]
    }),
    context: ({ req, res }) => ({ req, res })
  })
