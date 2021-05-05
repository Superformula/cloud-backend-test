import { gql } from 'apollo-server';

export const locationTypeDefs = gql`
	extend type Query {
		"""
		This API fetches and returns an array of a maximum of 5 locations from MapBox API, based on the given input, with the most relevant results first. Each location returned has the name of the fetched place and its coordinates.
		"""
		location(input: String!): [LocationInformation!]!
	}

	"""
	LocationInformation is the type of each location returned on the query that fetches relevant locations of a given input carries the property
	"""
	type LocationInformation {
		"""
		'name' refers to the full name of the place/location
		"""
		name: String!

		"""
		'coordinates' is an array of two floats that represent the longitude and the latitude respectively
		"""
		coordinates: [Float!]!
	}
`;

export default locationTypeDefs;
