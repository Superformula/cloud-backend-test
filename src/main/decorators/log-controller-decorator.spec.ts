import { faker } from '@faker-js/faker'
import { ControllerSpy } from '@main/test/mock-controllers'
import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy)

  return {
    controllerSpy,
    sut
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle with correct arguments', async () => {
    const { controllerSpy, sut } = makeSut()
    const request = faker.animal.bear()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  test('Should return httpResponse from controller', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(faker.animal.bear())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })
})
