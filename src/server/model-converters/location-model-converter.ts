import { LocationQueryOutput } from '../../fetch-location-lambda/types';
import { LocationInformation } from '../graphql/types';

// This class is meant to decouple the models from graphQL API from the models that are used by the FetchLocationLambda.
export class LocationModelConverter {
	fromLocationQueryOutputToGqlLocations(locationQueryOutput: LocationQueryOutput): LocationInformation[] {
		return locationQueryOutput.locations.map((loc) => ({
			name: loc.name,
			coordinates: loc.coordinates,
		}));
	}
}

export default LocationModelConverter;
