import { RetrieveCoordinatesHttpClientSpy } from '@data/test'
import { BadRequestError } from '@domain/errors/http-errors'
import { faker } from '@faker-js/faker'
import { DbRetrieveCoordinates } from './db-retrieve-coordinates'

interface SutTypes {
  sut: DbRetrieveCoordinates
  retrieveCoordinatesHttpClientSpy: RetrieveCoordinatesHttpClientSpy
}

const makeSut = (): SutTypes => {
  const retrieveCoordinatesHttpClientSpy = new RetrieveCoordinatesHttpClientSpy()
  const sut = new DbRetrieveCoordinates(retrieveCoordinatesHttpClientSpy)

  return {
    sut,
    retrieveCoordinatesHttpClientSpy
  }
}

describe('DbRetrieveCoordinates', () => {
  test('Should call RetrieveCoordinatesRepository with correct address', async () => {
    const { retrieveCoordinatesHttpClientSpy, sut } = makeSut()
    const address = faker.address.city()
    await sut.retrieveCoordinates(address)
    expect(retrieveCoordinatesHttpClientSpy.address).toBe(address)
  })

  test('Should return latitude and longitude coordinates on success', async () => {
    const { retrieveCoordinatesHttpClientSpy, sut } = makeSut()
    const coordinates = await sut.retrieveCoordinates(faker.address.city())
    expect(coordinates).toEqual(retrieveCoordinatesHttpClientSpy.result)
  })

  test('Should throw BadRequestError if RetrieveCoordinatesRepository returns null', async () => {
    const { retrieveCoordinatesHttpClientSpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesHttpClientSpy, 'retrieveCoordinates').mockReturnValueOnce(null)
    const promise = sut.retrieveCoordinates(faker.address.city())
    await expect(promise).rejects.toThrow(new BadRequestError('No information found for the given address.'))
  })

  test('Should throw if RetrieveCoordinatesRepository throws', async () => {
    const { retrieveCoordinatesHttpClientSpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesHttpClientSpy, 'retrieveCoordinates').mockImplementationOnce((): never => {
      throw new Error()
    })
    const promise = sut.retrieveCoordinates(faker.address.city())
    await expect(promise).rejects.toThrow()
  })
})
