import 'reflect-metadata'
import { setupApp } from '@main/config/app'
import request from 'supertest'
import { Express } from 'express'

let app: Express

describe('CoordinateResolver', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  describe('coordinate query', () => {
    const query = `query {
      coordinate(address: "barranco") {
        latitude
        longitude
      }
    }`

    test('Should return coordinates on success', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })

      expect(res.status).toBe(200)
      expect(res.body.data.coordinate.latitude).toBe(-12.144197)
      expect(res.body.data.coordinate.longitude).toBe(-77.020068)
    })
  })
})
