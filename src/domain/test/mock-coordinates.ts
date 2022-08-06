import { faker } from '@faker-js/faker'
import { Coordinate } from '@domain/models'

export const mockCoordinateModel = (): Coordinate => ({
  latitude: +faker.address.latitude(),
  longitude: +faker.address.longitude()
})
