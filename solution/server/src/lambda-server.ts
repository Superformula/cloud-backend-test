import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchemaSync } from '@graphql-tools/load'
import { ApolloServer } from 'apollo-server-lambda'
import { UserResolvers } from './resolvers/user-resolvers'
import { addResolversToSchema } from '@graphql-tools/schema'
import * as dotenv from 'dotenv'
import AWS from 'aws-sdk'
import Geocoding, { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding'

dotenv.config()

export type CloudBackEndTestContext = {
	dynamo: AWS.DynamoDB.DocumentClient
	mapbox: GeocodeService
}
const dynamo = new AWS.DynamoDB.DocumentClient()

// Mapbox API key on environment
const mapboxService = Geocoding({
	accessToken: process.env.MAPBOX_API_KEY ?? '',
})

const schema = loadSchemaSync('./schemas/schema.graphql', { loaders: [new GraphQLFileLoader()] })
const schemaWithResolvers = addResolversToSchema({
	schema,
	resolvers: UserResolvers,
})

const server = new ApolloServer({ schema: schemaWithResolvers, context: { dynamo, mapbox: mapboxService } })

exports.graphqlHandler = server.createHandler()
