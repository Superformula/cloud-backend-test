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
})
