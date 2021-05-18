/* eslint-disable */
import AWS from 'aws-sdk'

import { v4 } from 'uuid'
import { getRandomImageUrl } from '../utils/imageUrl.utils'
import { randomDob, randomCreatedAt } from '../utils/date.utils'

import cityGenerator from '../utils/cities.list'
import nameGenerator from '../utils/names.list'

import BaseModel from './abstract.dynamo-model'

const tableName = `our-dynamo-table`

/**
 * defines a user object
 */
export default class UserModel extends BaseModel {
	pk: string
	sk: string
	id: string
	dob: string
	name: string 
	createdAt: string

	address?: string
	imageUrl?: string
	updatedAt?: string
	description?: string

	/**
	 * default constructor
	 * @param payload an input object to populate the new model
	 */
	constructor(payload: Record<string, string> = {}) {
		super(tableName)
		
		this.pk = payload.pk
		this.sk = payload.sk
		
		this.id = payload.id
		this.dob = payload.dob
		this.name = payload.name
		this.address = payload.address
		this.imageUrl = payload.imageUrl
		this.createdAt = payload.createdAt
		this.updatedAt = payload.updatedAt
		this.description = payload.description
	}

	/**
	 * by definition, our SK is composed by a concatenation of the user's NAME and ID
	 * so, in order for us the separate them, se need to get 2 parts
	 * 1) a substring until the last 36 characters (a guuid length)
	 * 2) the last 36 characters
	 */
	breakSk()
	{
		if (this.sk) {
			if (this.sk.length < 36) throw new Error(`invalid sk`)

			const uuidIndex = this.sk.length - 36
			this.id = this.sk.substring(uuidIndex + 1)
			this.name = this.sk.substring(0, uuidIndex)
		}
	}

	/**
	 * when the item's id is null, we generates random values for id, name and address
	 * Otherwise this means that the object already exists in the database
	 * @async
	 */
	async generateRandomValues(): Promise<void>
	{
		this.id = v4()
		this.dob = randomDob()
		this.name = nameGenerator()
		this.address = cityGenerator()
		this.imageUrl = await getRandomImageUrl()
		this.createdAt = randomCreatedAt()
	}

	/**
	 * loads a UNIQUE item
	 * @param dynamoConn dynamo db connection
	 * @async
	 */
	async loadItem(dynamoConn: AWS.DynamoDB.DocumentClient): Promise<void> {
		if (!this.pk || !this.sk) throw new Error(`impossible to load an User without it's pk or sk`)

		this.breakSk()
		const request: AWS.DynamoDB.DocumentClient.QueryInput = {
			TableName: this.tableName,
			KeyConditionExpression: `pk = :pk and sk = :sk`,
			ExpressionAttributeValues: { ":pk": this.pk, ":sk": this.sk },
		}

		const userData = await this.load(request, dynamoConn)
		if (!userData || !Array.isArray(userData.Items)) throw new Error(`invalid dynamo response`)
		else if (userData && Array.isArray(userData.Items) && userData.Items.length > 1) throw new Error(`a DynamoDb table CANNOT have the same pk and sk for more than one items, please check your data`)
		else
		{
			this.dob = userData.Items[0].dob
			this.address = userData.Items[0].address
			this.imageUrl = userData.Items[0].imageUrl
			this.createdAt = userData.Items[0].createdAt
			this.updatedAt = userData.Items[0].updatedAt
			this.description = userData.Items[0].address
		}
	}

	/**
	 * loads the stored information for the current user
	 * @param dynamoConn dynamo db connection
	 * @param limit how muc items are going to be fetched per batch
	 * @param nectItem the token for the next batch of items
	 * @async
	 */
	async listUsers(dynamoConn: AWS.DynamoDB.DocumentClient, limit = 6, startKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined): Promise<UserModel[]> {
		const request: AWS.DynamoDB.DocumentClient.QueryInput = {
			TableName: tableName,
			Limit: limit,
			ExclusiveStartKey: startKey,
			KeyConditionExpression: `pk = :pk`,
			ExpressionAttributeValues: { ":pk": this.pk }
		}

		const userData = await this.list(request, dynamoConn)
		if (!userData || !Array.isArray(userData.Items)) throw new Error(`invalid request`)
		else return userData.Items.map((i) =>
		{
			const newItem = new UserModel({ ...i })
			newItem.breakSk()

			return newItem
		})
	}

	/**
	 * stores the current user information in the database
	 * aligned with the dynamo tb partition key schema, we need to create
	 * as many items as there are letters in it's name (convenientely no full name will go over 25 characters in length, wich is the BatchWriteItem limit)
	 * @param dynamoConn dynamo db connection
	 * @async
	 */
	async createUser(dynamoConn: AWS.DynamoDB.DocumentClient): Promise<void>
	{
		this.id = v4()
		this.sk = this.name + this.id

		const image = this.imageUrl || (await getRandomImageUrl())
		const nameNoSpaces = this.name.toLocaleLowerCase().replace(/\s/g, ``)
		const items: Record<string, unknown>[] = []
		while (items.length < (nameNoSpaces.length - 1))
			items.push({
				PutRequest: {
					Item: {
						pk: nameNoSpaces.substring(0, items.length + 1),
						sk: this.sk,

						dob: this.dob,
						address: this.address,
						imageUrl: image,
						createdAt: new Date().toJSON(),
						description: this.description
					}
				}
			})

		await this.batchWrite(this.newBatchWriteItemInput(items), dynamoConn)
	}
	/**
	 * updates the current user information in the database
	 * because of the focus on content delivery, the update is the heaviest operation of 'em all
	 * we could do a real update, but just for simplicity we'll call a delete followed by a create
	 * the one thing that we must be careful about is when the user updates it's name
	 * in that case, we'll need to load it's stored name, delete it
	 * and only then, we insert the updated values (while keeping the same ID)
	 * @param dynamoConn dynamo db connection
	 * @async
	 */
	async updateUser(dynamoConn: AWS.DynamoDB.DocumentClient): Promise<void>
	{
		await this.deleteUser(dynamoConn)
	}
	/**
	 * removes the current user information from the database
	 * like all other crud actions it must delete ALL existing items that references the curent user
	 * @param dynamoConn dynamo db connection
	 * @async
	 */
	async deleteUser(dynamoConn: AWS.DynamoDB.DocumentClient): Promise<void>
	{
		const nameNoSpaces = this.name.toLocaleLowerCase().replace(/\s/g, ``)
		const items: Record<string, unknown>[] = []
		while (items.length < (nameNoSpaces.length - 1))
			items.push({
				DeleteRequest: {
					Key: { partition_key: nameNoSpaces.substring(0, items.length + 1), name: this.name }
				}
			})

		try {
			const promise = new Promise<void>((resolve, reject) => {
				dynamoConn.batchWrite({ RequestItems: { 'our-dynamo-table': items } }, (err) => {
					if (err) reject(err)
					else {
						resolve()
					}
				})
			})

			await promise
		}
		catch (error)
		{
			console.log(`delete user error:`, error)
		}
	}
}