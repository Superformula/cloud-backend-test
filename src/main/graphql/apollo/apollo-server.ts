import { ApolloServer } from 'apollo-server-express'
import { GraphQLError } from 'graphql'
import { buildSchema } from 'type-graphql'
import { CoordinateResolver } from '../resolvers'

const checkErrorExists = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

const setHttpPlugin = {
  async requestDidStart () {
    return {
      async willSendResponse ({ response, errors }) {
        errors?.forEach((error: GraphQLError) => {
          response.data = undefined
          if (checkErrorExists(error, 'UserInputError')) {
            response.http.status = 400
          } else {
            response.http.status = 500
          }
        })
      }
    }
  }
}

export const setupApolloServer = async (): Promise<ApolloServer> =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [CoordinateResolver]
    }),
    context: ({ req, res }) => ({ req, res }),
    plugins: [setHttpPlugin as any]
  })
