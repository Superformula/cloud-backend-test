/* eslint camelcase: 0 */

import {
  IGeoCoder,
  ICoordinate,
} from './types';
import axios from 'axios';

export const errorMessages = new Map(
  [
    ['401', 'Check the access token you used in the query.'],
    ['403', 'Forbidden, there may be an issue with your account.'],
    ['404', 'Check the endpoint you used in the query.'],
    ['422', 'Invalid query. Please check your query parameters.'],
    ['429', 'You have exceeded your set rate limit.'],
  ],
);

/** Client for the Mapbox API */
export class MapboxGeoCoder implements IGeoCoder {
  /**
   * getCoordinatesByAddress
   *
   * @param {string} address
   * @return {Promise<ICoordinate>}
   */
  async getCoordinatesByAddress(address: string): Promise<ICoordinate> {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
    );
    url.searchParams.append(
      'access_token',
      `${process.env.MAPBOX_API_KEY}`,
    );
    return axios.get(url.toString()).then(async (response: any) => {
      const {features} = response.data;
      if (features && features.length > 0) {
        // NOTE: get the first feature that has coordinates
        const feature = features
          .find((f: any) => {
            const {center} = f;
            return center ? true : false;
          });
        if (feature) {
          return {
            latitude: feature.center[1],
            longitude: feature.center[0],
          };
        }
      }
      console.info('response', response);
      console.warn('Geocode not found');
      return Promise.reject(new Error('Geocode not found'));
    }).catch(
      (err) => {
        let errorMessage = `${err.message}`;
        if (err.response) {
          errorMessage = errorMessages.get(
            `${err.response.status}`,
          ) || errorMessage;
          console.warn(
            `The client was given an error response: ${err.response.status}`,
          );
        }
        console.warn(errorMessage);
        return Promise.reject(new Error(errorMessage));
      },
    );
  }
}
