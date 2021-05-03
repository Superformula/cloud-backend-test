import { UserInput } from '../../graphql/types/schema-types';
import { UserModel, UserPageModel } from '../models/user';
import AWS from 'aws-sdk';
import { UserInputError } from 'apollo-server-errors';
import moment from 'moment';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { ApolloError } from 'apollo-server-lambda';
import { DocumentClient, QueryOutput, ScanOutput } from 'aws-sdk/clients/dynamodb';
import { Maybe } from 'graphql/jsutils/Maybe';

export interface UserRepository {
	createUser(data: UserInput): Promise<UserModel>;
	updateUser(id: string, data: UserInput): Promise<UserModel>;
	deleteUser(id: string): Promise<UserModel>;
	getUser(id: string): Promise<UserModel>;
	listUsers(query: Maybe<string>, limit: number, cursor: Maybe<string>): Promise<UserPageModel>;
}

interface ValidatedInput extends UserInput {
	formattedDateOfBirth: string | null;
}

export class DynamoDBUserRepository implements UserRepository {
	private tableName: string;

	constructor(private database: AWS.DynamoDB.DocumentClient) {
		const tableName = process.env['USERS_TABLE_NAME'];

		if (!tableName) {
			throw new ApolloError('No users table name provided');
		}

		this.tableName = tableName;
	}

	async createUser(data: UserInput): Promise<UserModel> {
		if (!data.name) {
			throw new UserInputError('The name must be specified');
		}

		if (!data.dob) {
			throw new UserInputError('The date of birth must be specified');
		}

		if (!data.address) {
			throw new UserInputError('The address must be specified');
		}

		const validatedInput = this.validateInput(data);
		const user = {
			id: uuid(),
			name: data.name,
			address: data.address,
			description: data.description,
			dob: validatedInput.formattedDateOfBirth,
			createdAt: moment().toISOString(),
		} as UserModel;

		await this.database
			.put({
				TableName: this.tableName,
				Item: user,
			})
			.promise();

		return user;
	}

	async updateUser(id: string, data: UserInput): Promise<UserModel> {
		const validatedInput = this.validateInput(data);
		const user = await this.getUser(id);

		user.name = data.name || user.name;
		user.address = data.address || user.address;
		user.dob = validatedInput.formattedDateOfBirth || user.dob;
		user.description = data.description || user.description;
		user.updatedAt = moment().toISOString();

		// TODO: assess if it is worth to change this code to a update operation.
		// It might be faster but will require a more complex code for building the queries.
		// From a cost perspective, with an update I can cut out the previous read operation.
		await this.database
			.put({
				TableName: this.tableName,
				Item: user,
			})
			.promise();

		return user;
	}

	async getUser(id: string): Promise<UserModel> {
		const response = await this.database
			.get({
				TableName: this.tableName,
				Key: { id },
			})
			.promise();

		if (!response.Item) {
			throw new ApolloError(`Could not find user with id ${id}`);
		}

		return response.Item as UserModel;
	}

	async deleteUser(id: string): Promise<UserModel> {
		const result = await this.database
			.delete({
				TableName: this.tableName,
				Key: { id },
			})
			.promise();

		return result.Attributes as UserModel;
	}

	async listUsers(query: Maybe<string>, limit: number, cursor: Maybe<string>): Promise<UserPageModel> {
		// TODO: This API would be more powerful if it used a full text search engine. In production we should
		// use something like Elastic search to better fulfill its requirements.
		const searchParams = {
			TableName: this.tableName,
			Limit: limit,
			IndexName: 'UserNameIndex', //TODO: Extract this to environment variable,
			ExclusiveStartKey: cursor ? JSON.parse(cursor) : undefined,
		};

		let queryResult: QueryOutput | ScanOutput;
		if (query) {
			queryResult = await this.database
				.query({
					...searchParams,
					KeyConditionExpression: '#name = :query',
					ExpressionAttributeNames: { '#name': 'name' },
					ExpressionAttributeValues: { ':query': query },
				})
				.promise();
		} else {
			queryResult = await this.database.scan(searchParams).promise();
		}

		const queryItems = queryResult.Items as Pick<UserModel, 'id' | 'name'>[];

		let itemsResult: UserModel[] = [];
		if (queryItems && queryItems.length > 0) {
			const itemsToRequest: DocumentClient.BatchGetRequestMap = {};

			itemsToRequest[this.tableName] = {
				Keys: queryItems.map((i) => ({
					id: i.id,
				})),
			};

			const response = await this.database
				.batchGet({
					RequestItems: itemsToRequest,
				})
				.promise();

			if (!response.Responses) {
				// This should not happen;
				throw new ApolloError('Unexpected batch get items result');
			}

			itemsResult = response.Responses[this.tableName] as UserModel[];
		}

		return {
			items: itemsResult,
			cursor: queryResult.LastEvaluatedKey ? JSON.stringify(queryResult.LastEvaluatedKey) : null,
		};
	}

	private validateInput(data: UserInput): ValidatedInput {
		let parsedBirthDate: moment.Moment | null = null;

		if (data.dob) {
			// Since we are interested only on the date part, force a strict format
			parsedBirthDate = moment(data.dob, 'YYYY-MM-DD', true);
			if (!parsedBirthDate.isValid()) {
				throw new UserInputError('An invalid date of birth was provided');
			}
		}

		//TODO: declare input constraints in a better way
		if (data.address && !validator.isLength(data.address, { max: 250 })) {
			throw new UserInputError('The address max length is 250 characters');
		}

		if (data.name && !validator.isLength(data.name, { max: 100 })) {
			throw new UserInputError('The name max length is 100 characters');
		}

		if (data.description && !validator.isLength(data.description, { max: 1000 })) {
			throw new UserInputError('The description max length is 1000 characters');
		}

		return {
			...data,
			formattedDateOfBirth: parsedBirthDate ? parsedBirthDate.toISOString() : null,
		};
	}
}
