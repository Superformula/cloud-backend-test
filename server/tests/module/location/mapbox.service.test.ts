/* eslint-disable no-undef */

import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
import Geocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { MapboxService } from '../../../src/modules/location/mapbox.service';

const mockedSend = jest.fn().mockResolvedValue({} as MapiRequest);
jest.mock('@mapbox/mapbox-sdk/services/geocoding', () => jest.fn().mockImplementation(() => ({
  forwardGeocode: () => ({ send: mockedSend }),
})));

describe('Get geolocation service', () => {
  const testCoordinates = [-76.8333, -12];

  it('should return coordinates based on query', async () => {
    const expected = {
      latitude: testCoordinates[1],
      longitude: testCoordinates[0],
    };

    mockedSend.mockResolvedValueOnce({
      body: { features: [{ center: testCoordinates }] },
      statusCode: 200,
    });

    const geocodeService = Geocoding({ accessToken: 'token' });
    const locationService = new MapboxService(geocodeService);

    const res = await locationService.getGeolocation('Lima, Peru');
    expect(res).toEqual(expected);
  });

  it('should return null when no query matches found', async () => {
    mockedSend.mockResolvedValueOnce({
      body: { features: [] },
      statusCode: 200,
    });

    const geocodeService = Geocoding({ accessToken: 'token' });
    const locationService = new MapboxService(geocodeService);

    const res = await locationService.getGeolocation('123456789');
    expect(res).toBeNull();
  });

  it('should return error on service error', async () => {
    mockedSend.mockResolvedValueOnce({
      body: { features: [] },
      statusCode: 400,
    });

    const geocodeService = Geocoding({ accessToken: 'token' });
    const locationService = new MapboxService(geocodeService);

    await expect(locationService.getGeolocation('Test')).rejects.toThrow('Error getting coordinates.');
  });
});
