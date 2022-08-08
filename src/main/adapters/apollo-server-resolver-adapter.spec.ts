import { faker } from '@faker-js/faker'
import { ControllerSpy } from '@main/test'
import { ApolloError, UserInputError } from 'apollo-server-express'
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

  test('Should return Controller\'s response on success', async () => {
    const { result, controllerSpy } = await makeSut()
    expect(result).toEqual(controllerSpy.httpResponse.body)
  })

  test('Should throw UserInputError on 400 error', async () => {
    const controllerSpy = new ControllerSpy()
    const req = jest.fn() as any
    req.body = {}
    controllerSpy.httpResponse.statusCode = 400
    const promise = adaptResolver(controllerSpy, req, null)

    await expect(promise).rejects.toThrow(UserInputError)
  })

  test('Should throw ApolloError on 500 error', async () => {
    const controllerSpy = new ControllerSpy()
    const req = jest.fn() as any
    req.body = {}
    controllerSpy.httpResponse.statusCode = 500
    const promise = adaptResolver(controllerSpy, req, null)

    await expect(promise).rejects.toThrow(ApolloError)
  })
})
