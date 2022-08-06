import { RetrieveCoordinatesRepository } from '@data/protocols/http-clients/retrieve-coordinates-repository'
import { mockCoordinateModel } from '@domain/test/mock-coordinates'
import { faker } from '@faker-js/faker'
import { DbRetrieveCoordinates } from './db-retrieve-coordinates'

describe('SomeClassToTest', () => {
  test('Should call RetrieveCoordinatesRepository with correct address', async () => {
    class RetrieveCoordinatesRepositorySpy implements RetrieveCoordinatesRepository {
      address: string
      result = mockCoordinateModel()

      async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesRepository.Result> {
        this.address = address
        return this.result
      }
    }

    const retrieveCoordinatesRepositorySpy = new RetrieveCoordinatesRepositorySpy()

    const sut = new DbRetrieveCoordinates(retrieveCoordinatesRepositorySpy)

    const address = faker.address.city()

    await sut.retrieveCoordinates(address)

    expect(retrieveCoordinatesRepositorySpy.address).toBe(address)
  })
})
