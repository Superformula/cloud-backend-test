import axios from 'axios';
import { GeoLocation } from '@sf/core/location';

export interface LocationService {
  getGeoLocation(address: string): Promise<GeoLocation>;
}

export const locationService: LocationService = new (class implements LocationService {
  async getGeoLocation(address: string): Promise<GeoLocation> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      encodeURIComponent(address)
    }.json?limit=1&access_token=${process.env.MAP_BOX_ACCESS_TOKEN}`;
    const { data: { features } } = await axios.get(url);
    // TODO: Investigate error response types (including RATE_LIMIT) of Mapbox API and handle them.
    if (!features || features.length === 0) {
      throw new Error('No matching address');
    }

    const [lat, lng] = features[0].center;

    return { lat, lng };
  }
});
