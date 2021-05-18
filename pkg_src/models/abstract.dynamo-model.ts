import AWS from 'aws-sdk'

/**
 * a default behaviour for entities stored on DynamoDb
 */
export default abstract class DynamoDbBaseModel
{
	tableName: string

	/**
	 * default constructor for a new DynamoDbBaseModel
	 * @param tableName the dynamo db table that contains this entity's data
	 */
	constructor(tableName: string)
	{
		this.tableName = tableName
	}

	/**
	 * standard way to take advantage of the DynamoBaseModel abstract class to create batch payloads faster
	 * @param items the list of batch actions to be executed
	 * @returns a new batch input list wiith the desired items
	 */
	newBatchWriteItemInput(items: Record<string, unknown>[]): AWS.DynamoDB.DocumentClient.BatchWriteItemInput
	{
		const batchWriteInput: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = { RequestItems: {} }
		batchWriteInput.RequestItems[this.tableName] = items

		return batchWriteInput
	}

	/**
	 * loads the stored information for the current item
	 * @param dynamoConn dynamo db connection
	 */
	load(request: AWS.DynamoDB.DocumentClient.QueryInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.QueryOutput>
	{
		request.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
			dynamoConn.query(request, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}
	/**
	 * loads a list of stored items
	 * @param dynamoConn dynamo db connection
	 */
	list(request: AWS.DynamoDB.DocumentClient.QueryInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.QueryOutput>
	{
		request.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
			dynamoConn.query(request, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}

	/**
	 * stores, or updates, a given payload in a table
	 * @param payload the put's payload
	 * @param dynamoConn 
	 */
	put(payload: AWS.DynamoDB.DocumentClient.PutItemInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>
	{
		payload.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>((resolve, reject) => {
			dynamoConn.put(payload, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}
	/**
	 * removes an item from a table
	 * @param payload the delete's payload
	 * @param dynamoConn
	 */
	delete(payload: AWS.DynamoDB.DocumentClient.DeleteItemInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>
	{
		payload.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput>((resolve, reject) =>
		{
			dynamoConn.delete(payload, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}

	/**
	 * fetches a series of items from the database
	 * @param payload the batchGet's payload
	 * @param dynamoConn 
	 */
	batchGet(payload: AWS.DynamoDB.DocumentClient.BatchGetItemInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput>
	{
		payload.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.BatchGetItemOutput>((resolve, reject) => {
			dynamoConn.batchGet(payload, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}

	/**
	 * makes a series of operations in the database and returns the result
	 * @param payload the batchWrite's payload
	 * @param dynamoConn 
	 */
	batchWrite(payload: AWS.DynamoDB.DocumentClient.BatchWriteItemInput, dynamoConn: AWS.DynamoDB.DocumentClient): Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput>
	{
		payload.ReturnConsumedCapacity = `TOTAL`
		const promise = new Promise<AWS.DynamoDB.DocumentClient.BatchWriteItemOutput>((resolve, reject) => {
			dynamoConn.batchWrite(payload, (err, data) => {
				if (err) reject(err)
				else
				{
					// taking advantage of the abstract class
					// here we could have a method to evaluate all query performances
					// this.checkConsumedCapacity(data)
					resolve(data)
				}
			})
		})

		return promise
	}
}