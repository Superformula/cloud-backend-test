/* eslint-disable no-unused-vars */
import { GeolocationResult, Maybe } from '../../graphql/types/types';

/**
 * Location service interface
 */
export interface LocationService {
  getGeolocation(query: string): Promise<Maybe<GeolocationResult>>
}
