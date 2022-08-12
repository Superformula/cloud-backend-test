import { LogControllerDecorator } from '@main/decorators'
import { Controller } from '@presentation/protocols'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  // here, we could inject another dependency in charge of saving logs to our database
  return new LogControllerDecorator(controller)
}
