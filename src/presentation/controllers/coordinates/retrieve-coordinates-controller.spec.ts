import { mockRetrieveCoordinatesRequest, RetrieveCoordinatesSpy } from '@presentation/test'
import { RetrieveCoordinatesController } from './retrieve-coordinates-controller'

describe('RetrieveCoordinatesController', () => {
  test('Should call RetrieveCoordinates with correct address', async () => {
    const retrieveCoordinatesSpy = new RetrieveCoordinatesSpy()
    const sut = new RetrieveCoordinatesController(retrieveCoordinatesSpy)
    await sut.handle(mockRetrieveCoordinatesRequest)
    expect(retrieveCoordinatesSpy.address).toBe(mockRetrieveCoordinatesRequest.body.address)
  })
})
