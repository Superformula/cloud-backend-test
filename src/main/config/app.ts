import express, { Express } from 'express'
import { setupApolloServer } from '@main/graphql/apollo'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  const server = await setupApolloServer()
  await server.start()
  server.applyMiddleware({ app, cors: false })
  return app
}
