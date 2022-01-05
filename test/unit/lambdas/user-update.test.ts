import { handler } from '../../../src/lambdas/user-update'

describe('Should return error object', () => {
  test('On missing user id', async () => {
    let response = await handler({ arguments: { user: {} } })
    let expectedError = { error: { message: 'The user id is required', type: 'ValidationError' } }
    expect(response).toMatchObject(expectedError)
  })

  test('On missing arguments, nothing to update', async () => {
    let response = await handler({ arguments: { user: { id: '123' } } })
    let expectedError = { error: { message: 'No properties to update provided', type: 'ValidationError' } }
    expect(response).toMatchObject(expectedError)
  })
})
