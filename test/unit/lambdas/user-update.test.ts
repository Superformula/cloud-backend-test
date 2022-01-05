import * as AWS from 'aws-sdk'
import * as AWSMock from 'aws-sdk-mock'
import { UpdateItemInput } from 'aws-sdk/clients/dynamodb'
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

  test('On DynamoDB error', async () => {
    let expectedError = {
      error: {
        message: 'Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.',
        type: 'ConfigError',
      },
    }

    let response = await handler({ arguments: { user: { id: '123', address: '123 Fake St' } } })
    expect(response).toStrictEqual(expectedError)
  })
})

describe('Update user', () => {
  test('Update user and return all attributes', async () => {
    let updatedUser = {
      id: '123',
      name: 'Bruce Wayne',
      description: 'CEO of Wayne Enterprises',
      address: '123 Gotham St, Gotham',
      imageUrl: 'gotham.com/bruce-wayne.png',
      dob: '1969-08-07',
    }

    AWSMock.setSDKInstance(AWS)
    AWSMock.mock('DynamoDB.DocumentClient', 'update', (params: UpdateItemInput, callback: Function) => {
      callback(null, updatedUser)
    })

    const input: UpdateItemInput = { TableName: '', Key: {} }
    const client = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
    expect(await client.update(input).promise()).toStrictEqual(updatedUser)

    AWSMock.restore('DynamoDB.DocumentClient')
  })
})
