/* eslint max-len: 0 */
import { describe, it, beforeEach, afterAll, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { handler } from './graphql';
import { logger } from '@serverless-stack/core';
import * as mockEvent from '../../../__tests__/assets/event.json';
import * as mockEvent401 from '../../../__tests__/assets/event401.json';

describe('Unit tests geoDecoder', () => {
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
    process.env = OLD_ENV; // restore old env
  });

  it(
    'MapboxGeoCoder getCoordinatesByAddress with coordinates in results',
    async () => {
      const axiosGetSpy = vi.spyOn(axios, 'get');
      const address = 'Denver, Colorado, United States';
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json`,
      );
      url.searchParams.append(
        'access_token',
        `${process.env.MAPBOX_API_KEY}`,
      );
      const results = await handler(mockEvent, {}, () => {});
      logger.info('results', results);
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(url.toString());
      expect(results).toEqual(
        {
          statusCode: 200,
          body: '{"data":{"coordinate":{"__typename":"QueryCoordinateSuccess","data":{"latitude":39.739236,"longitude":-104.984862}}}}',
          headers: { 'Content-Type': 'application/json' },
        },
      );
    },
  );

  it(
    'MapboxGeoCoder getCoordinatesByAddress with 401',
    async () => {
      const axiosGetSpy = vi.spyOn(axios, 'get');
      const address = '401';
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address,
        )}.json`,
      );
      url.searchParams.append(
        'access_token',
        `${process.env.MAPBOX_API_KEY}`,
      );
      const results = await handler(mockEvent401, {}, () => {});
      logger.info('results', results);
      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(url.toString());
      expect(results).toEqual(
        {
          statusCode: 200,
          body: '{"data":{"coordinate":{"__typename":"Error","message":"Check the access token you used in the query."}}}',
          headers: { 'Content-Type': 'application/json' },
        },
      );
    },
  );
});
