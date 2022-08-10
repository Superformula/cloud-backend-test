import { LogControllerDecorator } from '@main/decorators'
import { ControllerSpy } from '@main/test'
import { Controller } from '@presentation/protocols'
import { makeLogControllerDecorator } from './log-controller-decorator-factory'

interface SutTypes {
  sut: Controller
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const sut = makeLogControllerDecorator(controllerSpy)
  return {
    sut
  }
}

describe('LogControllerDecoratorFactory', () => {
  test('Should return a LogControllerDecorator instance', async () => {
    const { sut } = makeSut()
    expect(sut).toBeInstanceOf(LogControllerDecorator)
  })
})
