import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { CoordinateResolver } from '../resolvers'

export const setupApolloServer = async (): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [CoordinateResolver]
    }),
    context: ({ req, res }) => ({ req, res })
  })
