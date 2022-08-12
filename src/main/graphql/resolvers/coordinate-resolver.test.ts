import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-lambda'
import { setupApolloServer } from '../apollo'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'

// https://www.apollographql.com/docs/apollo-server/testing/testing/

let app: ApolloServer
let query: string

describe('CoordinateResolver', () => {
  beforeAll(async () => {
    app = await setupApolloServer()
  })

  describe('coordinate query', () => {
    beforeEach(() => {
      query = `query {
        coordinate(address: "barranco") {
          latitude
          longitude
        }
      }`
    })

    test('Should return coordinates on success', async () => {
      const result = await app.executeOperation({ query })

      expect(result.errors).toBe(undefined)
      expect(result.extensions).toBe(undefined)
      expect(result.data.coordinate.latitude).toBe(-12.144197)
      expect(result.data.coordinate.longitude).toBe(-77.020068)
    })

    test('Should return UserInputError on invalid input', async () => {
      query = `query {
        coordinate(address: "barrancosss") {
          latitude
          longitude
        }
      }`

      const result = await app.executeOperation({ query })

      expect(result.data.coordinate).toBeNull()
      expect(result.errors[0].message).toBe('No information found for the given address.')
      expect((result.errors[0] as any).code).toBe('BAD_USER_INPUT')
    })

    test('Should return ApolloError on 500 error', async () => {
      httpMapClientsConstants.mapbox.GEOCODING_BASE_URL = 'fake_url'

      const result = await app.executeOperation({ query })

      expect((result.errors[0] as any).code).toBe('INTERNAL_SERVER_ERROR')
      expect(result.data.coordinate).toBeFalsy()
    })
  })
})
