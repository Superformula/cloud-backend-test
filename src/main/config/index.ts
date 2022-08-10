import 'module-alias/register'
import 'reflect-metadata'
import { setupApolloServer } from '../graphql/apollo/apollo-server'

export const handler = (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false
  setupApolloServer().then((server) => {
    server.createHandler({
      cors: {
        origin: '*'
      }
    })(event, context, callback)
  })
}
