import {
  describe,
  it,
  beforeEach,
  afterAll,
  expect,
  vi,
  afterEach,
} from 'vitest';
import axios from 'axios';
import {
  MapboxGeoCoder,
} from './mapbox';


describe('Mapbox Geocoder client', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env.MAPBOX_API_KEY = 'MAPBOX_DUMMY_TOKEN';
  });

  afterEach(
    () => {
      vi.restoreAllMocks();
    },
  );

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it(
    'getCoordinatesByAddress with coordinates in results',
    async () => {
      const axiosGetSpy = vi.spyOn(axios, 'get');
      const address = 'Denver, Colorado, USA';
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
      );
      url.searchParams.append(
        'access_token',
        `${process.env.MAPBOX_API_KEY}`,
      );
      const mapBoxGeoCoder = new MapboxGeoCoder();
      const results = await mapBoxGeoCoder.getCoordinatesByAddress(address);
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(url.toString());
      expect(results).toEqual({
        latitude: 39.739236,
        longitude: -104.984862,
      });
    },
  );

  it(
    'getCoordinatesByAddress without coordinates in results.',
    async () => {
      const axiosGetSpy = vi.spyOn(axios, 'get');
      const address = 'Dayton, Ohio, USA';
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
      );
      url.searchParams.append(
        'access_token',
        `${process.env.MAPBOX_API_KEY}`,
      );
      const mapBoxGeoCoder = new MapboxGeoCoder();
      expect(
        async () => mapBoxGeoCoder.getCoordinatesByAddress(address),
      ).rejects.toThrow('Geocode not found');
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(url.toString());
    },
  );

  it(
    'getCoordinatesByAddress without 401 HTTP status code.',
    async () => {
      const axiosGetSpy = vi.spyOn(axios, 'get');
      const address = '401';
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
      );
      url.searchParams.append(
        'access_token',
        `${process.env.MAPBOX_API_KEY}`,
      );
      const mapBoxGeoCoder = new MapboxGeoCoder();
      expect(
        async () => mapBoxGeoCoder.getCoordinatesByAddress(address),
      ).rejects.toThrow('Check the access token you used in the query.');
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(url.toString());
    },
  );
});
