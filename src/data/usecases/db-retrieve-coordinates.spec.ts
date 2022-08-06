import { RetrieveCoordinatesRepository } from '@data/protocols/http-clients/retrieve-coordinates-repository'
import { mockCoordinateModel } from '@domain/test/mock-coordinates'
import { faker } from '@faker-js/faker'
import { DbRetrieveCoordinates } from './db-retrieve-coordinates'

class RetrieveCoordinatesRepositorySpy implements RetrieveCoordinatesRepository {
  address: string
  result = mockCoordinateModel()

  async retrieveCoordinates (address: string): Promise<RetrieveCoordinatesRepository.Result> {
    this.address = address
    return this.result
  }
}

interface SutTypes {
  sut: DbRetrieveCoordinates
  retrieveCoordinatesRepositorySpy: RetrieveCoordinatesRepositorySpy
}

const makeSut = (): SutTypes => {
  const retrieveCoordinatesRepositorySpy = new RetrieveCoordinatesRepositorySpy()
  const sut = new DbRetrieveCoordinates(retrieveCoordinatesRepositorySpy)

  return {
    sut,
    retrieveCoordinatesRepositorySpy
  }
}

describe('DbRetrieveCoordinates', () => {
  test('Should call RetrieveCoordinatesRepository with correct address', async () => {
    const { retrieveCoordinatesRepositorySpy, sut } = makeSut()

    const address = faker.address.city()

    await sut.retrieveCoordinates(address)

    expect(retrieveCoordinatesRepositorySpy.address).toBe(address)
  })

  test('Should return latitude and longitude coordinates on success', async () => {
    const { retrieveCoordinatesRepositorySpy, sut } = makeSut()
    const coordinates = await sut.retrieveCoordinates(faker.address.city())
    expect(coordinates).toEqual(retrieveCoordinatesRepositorySpy.result)
  })

  test('Should throw if RetrieveCoordinatesRepository throws', async () => {
    const { retrieveCoordinatesRepositorySpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesRepositorySpy, 'retrieveCoordinates').mockImplementationOnce((): never => { throw new Error() })
    const promise = sut.retrieveCoordinates(faker.address.city())
    await expect(promise).rejects.toThrow()
  })
})
