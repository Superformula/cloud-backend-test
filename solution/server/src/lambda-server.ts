import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { ApolloServer } from 'apollo-server-lambda'
import { resolvers } from './resolvers/resolvers'
import { addResolversToSchema } from '@graphql-tools/schema'
//import { typeDefs } from './schemas/schema'

const schema = loadSchemaSync('./schemas/schema.graphql', { loaders: [new GraphQLFileLoader()] })
const schemaWithResolvers = addResolversToSchema({
	schema,
	resolvers,
})
const server = new ApolloServer({ schema: schemaWithResolvers })

exports.graphqlHandler = server.createHandler()
