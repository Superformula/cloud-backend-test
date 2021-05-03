import { ApolloServer } from 'apollo-server-lambda'
import * as dotenv from 'dotenv'
import AWS from 'aws-sdk'
import Geocoding, { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding'
import resolvers from './resolvers/merge-resolvers'
import typeDefs from './schemas/merge-schemas'

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

const stageName = process.env.DEPLOYMENT_STAGE_NAME ?? ''

console.log(`CloudBackEndTestLambda - Deployment stage: ${stageName}`)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: { dynamo, mapbox: mapboxService },
	playground: {
		endpoint: `/${stageName}/graphql`,
	},
})

exports.graphqlHandler = server.createHandler()
