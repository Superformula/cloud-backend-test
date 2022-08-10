import { Coordinate } from '@domain/models'
import { mockCoordinateModel } from '@domain/test'
import { RetrieveCoordinates } from '@domain/usecases'
import { faker } from '@faker-js/faker'

export const mockRetrieveCoordinatesRequest = {
  address: faker.address.city()
}

export class RetrieveCoordinatesSpy implements RetrieveCoordinates {
  address: string
  coordinates = mockCoordinateModel()

  async retrieveCoordinates (address: string): Promise<Coordinate> {
    this.address = address
    return this.coordinates
  }
}
