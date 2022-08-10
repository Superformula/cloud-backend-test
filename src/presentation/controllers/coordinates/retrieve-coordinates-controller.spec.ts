import { catchError, ok } from '@presentation/helpers'
import { mockRetrieveCoordinatesRequest, RetrieveCoordinatesSpy } from '@presentation/test'
import { RetrieveCoordinatesController } from './retrieve-coordinates-controller'

interface SutTypes {
  sut: RetrieveCoordinatesController
  retrieveCoordinatesSpy: RetrieveCoordinatesSpy
}

const makeSut = (): SutTypes => {
  const retrieveCoordinatesSpy = new RetrieveCoordinatesSpy()
  const sut = new RetrieveCoordinatesController(retrieveCoordinatesSpy)

  return {
    retrieveCoordinatesSpy,
    sut
  }
}

describe('RetrieveCoordinatesController', () => {
  test('Should call RetrieveCoordinates with correct address', async () => {
    const { retrieveCoordinatesSpy, sut } = makeSut()
    await sut.handle(mockRetrieveCoordinatesRequest)
    expect(retrieveCoordinatesSpy.address).toBe(mockRetrieveCoordinatesRequest.address)
  })

  test('Should return coordinates on success', async () => {
    const { retrieveCoordinatesSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRetrieveCoordinatesRequest)
    expect(httpResponse).toEqual(ok(retrieveCoordinatesSpy.coordinates))
  })

  test('Should return catchError if RetrieveCoordinates throws', async () => {
    const { retrieveCoordinatesSpy, sut } = makeSut()
    jest.spyOn(retrieveCoordinatesSpy, 'retrieveCoordinates').mockImplementationOnce((): never => {
      throw new Error()
    })

    const httpResponse = await sut.handle(mockRetrieveCoordinatesRequest)
    expect(httpResponse).toEqual(catchError(new Error()))
  })
})
