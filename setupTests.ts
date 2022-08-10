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
          errorMessage: 'Check the access token you used in the query.',
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
