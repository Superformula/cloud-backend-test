import { faker } from '@faker-js/faker'
import { ControllerMock, ControllerSpy } from '@main/test'
import { adaptResolver } from './apollo-server-resolver-adapter'

describe('ApolloServerResolverAdapter', () => {
  test('Should add agrs to request body', async () => {
    const controllerMock = new ControllerMock()
    const req = jest.fn() as any
    req.body = {}
    const args = { [faker.datatype.string()]: faker.random.word() }
    await adaptResolver(controllerMock, req, args)
    expect(req.body).toEqual(args)
  })

  test('Should call Controller with correct arguments', async () => {
    const controllerSpy = new ControllerSpy()
    const req = jest.fn() as any
    req.body = {}
    const args = { [faker.datatype.string()]: faker.random.word() }
    await adaptResolver(controllerSpy, req, args)
    expect(controllerSpy.request).toEqual(req)
  })

  test('Should return Controller\'s response', async () => {
    const controllerSpy = new ControllerSpy()
    const req = jest.fn() as any
    const result = await adaptResolver(controllerSpy, req, null)
    expect(result).toEqual(controllerSpy.httpResponse.body)
  })
})
