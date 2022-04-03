import { GeocodeResponse, GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';
import { ApolloError } from 'apollo-server-lambda';
import { Maybe, GeolocationResult } from '../../graphql/types/types';
import { LocationService } from './location.service';

/**
 * Implementation of LocationService using Mapbox SDK
 */
export class MapboxService implements LocationService {
  service: GeocodeService;

  /**
   * @param {GeocodeService} geocode Service instance from mapbox SDK
   */
  constructor(geocode: GeocodeService) {
    this.service = geocode;
  }

  /**
   * Get geolocation data with address query.
   * @param {string} query Address query to fetch location data
   * @returns {Maybe<GeolocationResult>} Location coordinates of best query match
   */
  async getGeolocation(query: string): Promise<Maybe<GeolocationResult>> {
    try {
      const req = this.service.forwardGeocode({
        query,
        limit: 1,
        mode: 'mapbox.places',
      });

      const result = await req.send();

      if (result.statusCode < 200 || result.statusCode >= 300) {
        return Promise.reject(new ApolloError('Error getting coordinates.'));
      }

      const body = result.body as GeocodeResponse;

      if (!body.features || body.features.length === 0) {
        return Promise.resolve(null);
      }

      return Promise.resolve({
        longitude: body.features[0].center[0],
        latitude: body.features[0].center[1],
      });
    } catch (error) {
      return Promise.reject(new ApolloError('Error getting coordinates.'));
    }
  }
}
