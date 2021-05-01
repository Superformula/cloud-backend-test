import * as AWSMock from 'jest-aws-sdk-mock'
import AWS, { AWSError } from 'aws-sdk'
import { GetItemInput, AttributeValue, GetItemOutput } from 'aws-sdk/clients/dynamodb'

it('should sum work', async () => {
	expect(4 + 3).toEqual(7)
})

it('should DynamoDB mock work', async () => {
	try {
		AWSMock.setSDKInstance(AWS)
		AWSMock.mock('DynamoDB.DocumentClient', 'get', (_params: GetItemInput, callback: (err: AWSError | null, data: GetItemOutput) => void) => {
			callback(null, { Item: { Key: 'Value' as AttributeValue } })
		})

		const ddb = new AWS.DynamoDB.DocumentClient()

		const input: GetItemInput = {
			TableName: '',
			Key: {
				Key: '' as AttributeValue,
			},
		}

		const response = await ddb
			.get(input)
			.promise()
			.catch((err) => {
				throw err
			})
		expect(response.Item).toEqual({ Key: 'Value' })
	} catch (error) {
		console.log(`Error`, error)
	} finally {
		AWSMock.restore('DynamoDB.DocumentClient')
	}
})
