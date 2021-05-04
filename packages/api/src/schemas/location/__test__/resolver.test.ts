import resolver from '../resolver';
import * as Services from '@sf/api/services';

jest.mock('@sf/api/services');

describe('Query getGeoLocation', () => {
  it('returns GeoLocation info from the service', async () => {
    jest.spyOn(Services.locationService, 'getGeoLocation').mockResolvedValue({
      lat: 10,
      lng: 10,
    });

    const { getGeoLocation } = resolver.Query;
    const response = await getGeoLocation({}, { address: 'Address' });
    expect(Services.locationService.getGeoLocation).toBeCalledWith('Address');
    expect(response).toEqual({ lat: 10, lng: 10 });
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.locationService, 'getGeoLocation').mockRejectedValue({});
    const { getGeoLocation } = resolver.Query;
    try {
      await getGeoLocation({}, { address: 'Address' });
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.locationService.getGeoLocation).toBeCalledWith('Address');
  });
});
