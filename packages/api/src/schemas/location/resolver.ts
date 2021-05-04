import { locationService } from '@sf/api/services';
import { GeoLocation, QueryGetGeoLocationArgs } from '@sf/core/location';

const resolver = {
  Query: {
    async getGeoLocation(_, args: QueryGetGeoLocationArgs): Promise<GeoLocation> {
      const { address } = args;
      return locationService.getGeoLocation(address);
    },
  }
};

export default resolver;
