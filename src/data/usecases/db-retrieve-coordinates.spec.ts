import { RetrieveCoordinatesRepositorySpy } from '@data/test'
import { BadRequestError } from '@domain/errors/http-errors'
import { faker } from '@faker-js/faker'
import { DbRetrieveCoordinates } from './db-retrieve-coordinates'

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

  test('Should throw BadRequestError if RetrieveCoordinatesRepository returns null', async () => {
    const { retrieveCoordinatesRepositorySpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesRepositorySpy, 'retrieveCoordinates').mockReturnValueOnce(null)
    const promise = sut.retrieveCoordinates(faker.address.city())
    await expect(promise).rejects.toThrow(new BadRequestError('No information found for the given address.'))
  })

  test('Should throw if RetrieveCoordinatesRepository throws', async () => {
    const { retrieveCoordinatesRepositorySpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesRepositorySpy, 'retrieveCoordinates').mockImplementationOnce((): never => {
      throw new Error()
    })
    const promise = sut.retrieveCoordinates(faker.address.city())
    await expect(promise).rejects.toThrow()
  })
})
