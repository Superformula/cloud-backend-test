import { ApolloServer } from 'apollo-server-lambda'
import * as dotenv from 'dotenv'
import AWS from 'aws-sdk'
import Geocoding, { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding'
import resolvers from './resolvers/merge-resolvers'
import typeDefs from './schemas/merge-schemas'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

dotenv.config()

export type CloudBackEndTestContext = {
	dynamo: DocumentClient
	mapbox: GeocodeService
}

if (process.env.LOCAL_DYNAMODB) {
	AWS.config.update({
		dynamodb: {
			endpoint: process.env.LOCAL_DYNAMODB,
		},
	})
}

const dynamo: DocumentClient = new AWS.DynamoDB.DocumentClient()

// Mapbox API key on environment
const mapboxService = Geocoding({
	accessToken: process.env.MAPBOX_API_KEY ?? '',
})

const server = new ApolloServer({ typeDefs, resolvers, context: { dynamo, mapbox: mapboxService } })

exports.graphqlHandler = server.createHandler()
