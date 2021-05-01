import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { ApolloServer } from 'apollo-server-lambda'
import { UserResolvers } from './resolvers/user-resolvers'
import { addResolversToSchema } from '@graphql-tools/schema'
import * as dotenv from 'dotenv'
import AWS from 'aws-sdk'

dotenv.config()

export type CloudBackEndTestContext = {
	dynamo: AWS.DynamoDB.DocumentClient
}
const dynamo = new AWS.DynamoDB.DocumentClient()

const schema = loadSchemaSync('./schemas/schema.graphql', { loaders: [new GraphQLFileLoader()] })
const schemaWithResolvers = addResolversToSchema({
	schema,
	resolvers: UserResolvers,
})

const server = new ApolloServer({ schema: schemaWithResolvers, context: { dynamo } })

exports.graphqlHandler = server.createHandler()
