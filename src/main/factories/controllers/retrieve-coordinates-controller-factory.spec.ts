import { LogControllerDecorator } from '@main/decorators'
import { RetrieveCoordinatesController } from '@presentation/controllers/coordinates'
import { makeDbRetrieveCoordinates } from '../usecases'
import { makeRetrieveCoordinatesController } from './retrieve-coordinates-controller-factory'

jest.mock('@main/decorators/log-controller-decorator')

describe('RetrieveCoordinateControllerFactory', () => {
  test('Should invoke LogControllerDecorator with correct dependencies', () => {
    makeRetrieveCoordinatesController()
    expect(LogControllerDecorator).toHaveBeenCalledWith(new RetrieveCoordinatesController(makeDbRetrieveCoordinates()))
  })

  test('Should return a LogControllerDecorator instance', async () => {
    const sut = makeRetrieveCoordinatesController()
    expect(sut).toBeInstanceOf(LogControllerDecorator)
  })
})
