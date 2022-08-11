import {
  afterAll,
  afterEach,
  beforeAll,
} from 'vitest';
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import * as mapboxResults from
  './__tests__/assets/mapboxSampleResponse.json';

export const restHandlers = [
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Denver*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mapboxResults));
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Dayton*', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/401*', (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.json(
        {
          error: {
            message: 'Check the access token you used in the query.'
          }
        },
      ),
    );
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/403*', (req, res, ctx) => {
    return res(
      ctx.status(403),
      ctx.json(
        {
          error: {
            message: 'Forbidden, there may be an issue with your account.'
          }
        },
      ),
    );
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/404*', (req, res, ctx) => {
    return res(
      ctx.status(404),
      ctx.json(
        {
          error: {
            message: 'Check the endpoint you used in the query.'
          }
        },
      ),
    );
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/422*', (req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json(
        {
          error: {
            message: 'Invalid query. Please check your query parameters.'
          }
        },
      ),
    );
  }),
  rest.get('https://api.mapbox.com/geocoding/v5/mapbox.places/429*', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.json(
        {
          error: {
            message: 'You have exceeded your set rate limit.'
          }
        },
      ),
    );
  }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({onUnhandledRequest: 'error'}));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
