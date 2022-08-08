import { RetrieveCoordinatesController } from '@presentation/controllers/coordinates'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from '../decorators/log-controller-decorator-factory'
import { makeDbRetrieveCoordinates } from '../usecases'

export const makeRetrieveCoordinatesController = (): Controller => {
  const retrieveCoordinatesController = new RetrieveCoordinatesController(makeDbRetrieveCoordinates())
  return makeLogControllerDecorator(retrieveCoordinatesController)
}
