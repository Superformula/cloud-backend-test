import { ok } from '@presentation/helpers'
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
    expect(retrieveCoordinatesSpy.address).toBe(mockRetrieveCoordinatesRequest.body.address)
  })

  test('Should return coordinates on success', async () => {
    const { retrieveCoordinatesSpy, sut } = makeSut()
    const httpResponse = await sut.handle(mockRetrieveCoordinatesRequest)
    expect(httpResponse).toEqual(ok(retrieveCoordinatesSpy.coordinates))
  })
})
