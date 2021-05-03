import { CloudBackEndTestContext } from '../lambda-server'
import { FindAddressAsync } from '../mapbox-access'
import { Resolvers } from '../types/types'

export const AddressResolver: Resolvers<CloudBackEndTestContext> = {
	Query: {
		queryAddress: async (_parent, { location }, { mapbox }) => {
			const mapboxResponse = await FindAddressAsync(mapbox, location)
			return mapboxResponse.map((item) => {
				return {
					longitude: item.center[0],
					latitude: item.center[1],
					place: item.place_name,
				}
			})
		},
	},
}
