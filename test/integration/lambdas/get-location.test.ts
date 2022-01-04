import { handler } from '../../../src/lambdas/get-location'

test('get location lambda should return coordinates for Central Park', () => {
  const event = { arguments : { address: 'Central Park' }}

  const expectedResponse = {
    statusCode: 200,
    coordinates: [-73.98, 40.77]
  }

  expect(handler(event)).toBe(expectedResponse)
})