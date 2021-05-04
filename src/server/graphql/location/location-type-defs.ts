import { gql } from 'apollo-server';

export const locationTypeDefs = gql`
	extend type Query {
		"""
		This API fetches and returns an array of a maximum of 5 locations from MapBox API, based on the given input, with the most relevant results first. Each location returned has the name of the fetched place and its coordinates.
		"""
		location(input: String!): [LocationInformation!]!
	}

	"""
	LocationInformation type carries the property "name", which is the full name of the place/location, and coordinates, which is an array of two floats that represent the longitude and the latitude respectively.
	"""
	type LocationInformation {
		name: String!
		coordinates: [Float!]!
	}
`;

export default locationTypeDefs;
