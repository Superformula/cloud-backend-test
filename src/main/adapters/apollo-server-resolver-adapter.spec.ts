import { faker } from '@faker-js/faker'
import { ControllerSpy } from '@main/test'
import { ApolloError, UserInputError } from 'apollo-server-lambda'
import { adaptResolver } from './apollo-server-resolver-adapter'

interface SutTypes {
  controllerSpy: ControllerSpy
  args: object
  result: Promise<any>
}

const makeSut = async (): Promise<SutTypes> => {
  const controllerSpy = new ControllerSpy()
  const args = { [faker.datatype.string()]: faker.random.word() }
  const result = await adaptResolver(controllerSpy, args)

  return {
    controllerSpy,
    args,
    result
  }
}

describe('ApolloServerResolverAdapter', () => {
  test('Should call controller with empty object if no args are given', async () => {
    const controllerSpy = new ControllerSpy()
    await adaptResolver(controllerSpy)
    expect(controllerSpy.request).toEqual({})
  })

  test('Should call Controller with correct arguments', async () => {
    const { controllerSpy, args } = await makeSut()
    expect(controllerSpy.request).toEqual(args)
  })

  test('Should return Controller\'s response on success', async () => {
    const { result, controllerSpy } = await makeSut()
    expect(result).toEqual(controllerSpy.httpResponse.body)
  })

  test('Should throw UserInputError on 400 error', async () => {
    const controllerSpy = new ControllerSpy()
    controllerSpy.httpResponse.statusCode = 400
    const promise = adaptResolver(controllerSpy, {}, null)

    await expect(promise).rejects.toThrow(UserInputError)
  })

  test('Should throw ApolloError on 500 error', async () => {
    const controllerSpy = new ControllerSpy()
    controllerSpy.httpResponse.statusCode = 500
    const promise = adaptResolver(controllerSpy, {}, null)

    await expect(promise).rejects.toThrow(ApolloError)
  })
})
