import { Context } from '../../types/context';
import { Resolvers } from '../types';

export const locationResolvers: Resolvers<Context> = {
	Query: {
		location: async (_parent, args, context) => {
			const locationOutput = await context.dataSources.locationDataSource.fetchLocationInfo(args.input);
			return context.locationModelConverter.fromLocationQueryOutputToGqlLocations(locationOutput);
		},
	},
};

export default locationResolvers;
