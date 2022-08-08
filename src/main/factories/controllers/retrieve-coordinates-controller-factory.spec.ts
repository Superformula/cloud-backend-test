import { LogControllerDecorator } from '@main/decorators'
import { makeRetrieveCoordinatesController } from './retrieve-coordinates-controller-factory'

describe('RetrieveCoordinateControllerFactory', () => {
  test('Should return a LogControllerDecorator instance', async () => {
    const sut = makeRetrieveCoordinatesController()
    expect(sut).toBeInstanceOf(LogControllerDecorator)
  })
})
