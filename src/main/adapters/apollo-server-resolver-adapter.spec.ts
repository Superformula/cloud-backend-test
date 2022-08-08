import { faker } from '@faker-js/faker'
import { ControllerMock, ControllerSpy } from '@main/test'
import { adaptResolver } from './apollo-server-resolver-adapter'

interface SutTypes {
  req: any
  controllerSpy: ControllerSpy
  args: object
  result: Promise<any>
}

const makeSut = async (): Promise<SutTypes> => {
  const controllerSpy = new ControllerSpy()
  const req = jest.fn() as any
  req.body = {}
  const args = { [faker.datatype.string()]: faker.random.word() }
  const result = await adaptResolver(controllerSpy, req, args)

  return {
    req,
    controllerSpy,
    args,
    result
  }
}

describe('ApolloServerResolverAdapter', () => {
  test('Should add agrs to request body', async () => {
    const { req, args } = await makeSut()
    expect(req.body).toEqual(args)
  })

  test('Should call Controller with correct arguments', async () => {
    const { req, controllerSpy } = await makeSut()
    expect(controllerSpy.request).toEqual(req)
  })

  test('Should return Controller\'s response', async () => {
    const { result, controllerSpy } = await makeSut()
    expect(result).toEqual(controllerSpy.httpResponse.body)
  })
})
