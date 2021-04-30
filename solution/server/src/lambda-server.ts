import { ApolloServer } from 'apollo-server-lambda'
import { resolvers } from './resolvers/resolvers'
import { typeDefs } from './schemas/schemas'

const server = new ApolloServer({ typeDefs, resolvers })

exports.graphqlHandler = server.createHandler()
