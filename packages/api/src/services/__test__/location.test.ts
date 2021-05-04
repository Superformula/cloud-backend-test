import axios from 'axios';
import { locationService } from '../location';

jest.mock('axios');

describe('getGeoLocation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns geoLocation from mapbox api', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { features: [{ center: [1, 2] }] },
    });
    process.env.MAP_BOX_ACCESS_TOKEN = 'TOKEN';

    const coordinates = await locationService.getGeoLocation('address');
    expect(axios.get).toBeCalledWith(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/address.json?limit=1&access_token=TOKEN'
    );
    expect(coordinates).toEqual({ lat: 1, lng: 2 });
  });

  it('throws error when address invalid', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: { features: [] },
    });
    process.env.MAP_BOX_ACCESS_TOKEN = 'TOKEN';

    try {
      await locationService.getGeoLocation('address');
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(axios.get).toBeCalledWith(
      'https://api.mapbox.com/geocoding/v5/mapbox.places/address.json?limit=1&access_token=TOKEN'
    );
  });
});
