import 'reflect-metadata'
import { setupApp } from '@main/config/app'
import { Express } from 'express'
import request from 'supertest'
import { httpMapClientsConstants } from '@infrastructure/http-clients/settings'

let app: Express
let query: string

describe('CoordinateResolver', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  describe('coordinate query', () => {
    beforeEach(async () => {
      query = `query {
        coordinate(address: "barranco") {
          latitude
          longitude
        }
      }`
    })

    test('Should return coordinates on success', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.coordinate.latitude).toBe(-12.144197)
      expect(res.body.data.coordinate.longitude).toBe(-77.020068)
    })

    test('Should return UserInputError on invalid input', async () => {
      query = `query {
        coordinate(address: "barrancosss") {
          latitude
          longitude
        }
      }`

      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(400)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe('No information found for the given address.')
    })

    test('Should return ApolloError on 500 error', async () => {
      httpMapClientsConstants.mapbox.ACCESS_TOKEN = 'fake_token'

      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(500)
      expect(res.body.data).toBeFalsy()
    })
  })
})
