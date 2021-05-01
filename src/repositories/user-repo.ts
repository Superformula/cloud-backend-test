import { AWSError } from 'aws-sdk';
import { DeleteItemOutput, DocumentClient, GetItemOutput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { IRepo } from './irepo';
import { ApolloError } from 'apollo-server-errors';
import { Maybe, UserCreationInput, UserUpdateInput } from '../types/graphql';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ErrorCodes } from '../enums/error-codes';
import { buildSimpleUpdateItemInput } from '../misc/utils';

export type UserModel = {
	id: string;
	name: string;
	dob: string;
	address?: Maybe<string>;
	description?: Maybe<string>;
	imageUrl?: Maybe<string>;
	createdAt: string;
	updatedAt: string;
};

export class UserRepo extends DataSource implements IRepo<UserModel, UserCreationInput, UserUpdateInput> {
	private readonly tableName = 'Users';
	private docCient: DocumentClient;

	constructor() {
		super();
		this.docCient = new DocumentClient();
	}

	async getItem(id: string): Promise<UserModel> {
		let res: PromiseResult<GetItemOutput, AWSError>;

		// try to get an user; if everything goes well, return the user; if "get" command fails, catch, format and throw exception
		try {
			res = await this.docCient
				.get({
					TableName: this.tableName,
					Key: { id },
				})
				.promise();
		} catch (err) {
			throw new ApolloError('An error occurred while trying to fetch user.', ErrorCodes.GET_USER_FAILED, err);
		}

		// if "get" command returned a user, return it back as well; if res.Item is empty, throw exception telling that the user was not found
		if (res.Item) {
			return res.Item as UserModel;
		} else {
			throw new ApolloError(`User with ID '${id}' not found.`, ErrorCodes.USER_NOT_FOUND);
		}
	}

	async putItem(input: UserCreationInput): Promise<UserModel> {
		// get current date as UTC to fulfill fields createdAt and updatedAt
		const currentDate = new Date().toUTCString();

		// map the user creation input to a user model to be passed to DynamoDB
		const item: UserModel = {
			id: uuidv4(),
			name: input.name,
			dob: input.dob,
			address: input.address,
			description: input.description,
			imageUrl: input.imageUrl,
			createdAt: currentDate,
			updatedAt: currentDate,
		};

		// try to create user; if everything goes well, return the user; if the "put" command fails, catch, format and throw exception
		try {
			await this.docCient
				.put({
					TableName: this.tableName,
					Item: item,
				})
				.promise();
			return item;
		} catch (err) {
			throw new ApolloError('An error occurred while trying to create user.', ErrorCodes.PUT_USER_FAILED, err);
		}
	}

	async updateItem(id: string, input: UserUpdateInput): Promise<UserModel> {
		let res: PromiseResult<UpdateItemOutput, AWSError>;

		// get current date as UTC to update the field updatedAt
		const currentDate = new Date().toUTCString();
		const updateItemInput = buildSimpleUpdateItemInput(this.tableName, id, { ...input, updatedAt: currentDate });

		// try to update user; if everything goes well, return the user; if the "update" command fails, catch, format and throw exception
		try {
			res = await this.docCient.update({ ...updateItemInput, ReturnValues: 'ALL_NEW' }).promise();
		} catch (err) {
			throw new ApolloError('An error occurred while trying to update user.', ErrorCodes.UPDATE_USER_FAILED, err);
		}

		// just return the user (inside res.Attributes), since, when set to ALL_NEW, "update" command will either fulfill property "Attributes"
		// and succeed or fail and throw the exception above.
		return res.Attributes as UserModel;
	}

	async deleteItem(id: string): Promise<UserModel> {
		let res: PromiseResult<DeleteItemOutput, AWSError>;

		// try to delete user; if everything goes well, return the user; if the "delete" command fails, catch, format and throw exception
		try {
			res = await this.docCient
				.delete({
					TableName: this.tableName,
					Key: { id },
					ReturnValues: 'ALL_OLD',
				})
				.promise();
		} catch (err) {
			throw new ApolloError('An error occurred while trying to delete user.', ErrorCodes.DELETE_USER_FAILED, err);
		}

		// if "delete" command found the user, deleted it, and returned it (res.Attributes is fulfilled), return it back as well;
		// otherwise, if user was not found (res.Attributes is empty), throw exception explaining that.
		if (res.Attributes) {
			return res.Attributes as UserModel;
		} else {
			throw new ApolloError(
				`User with ID '${id}' not found; hence, delete operation failed.`,
				ErrorCodes.USER_NOT_FOUND,
			);
		}
	}
}

export default UserRepo;
