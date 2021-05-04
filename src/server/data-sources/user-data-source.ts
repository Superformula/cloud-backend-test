import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-server-errors';
import { Maybe, PaginationInput } from '../graphql/types';
import { ErrorCodes } from '../enums/error-codes';
import { buildSimpleUpdateItemInput } from '../misc/utils';
import { UserCreationModel, UserModel, UserUpdateModel } from '../data-source-models/user-models';
import { PaginationOutputModel } from '../data-source-models/pagination-output-model';

export class UserDataSource extends DataSource {
	private readonly tableName = 'Users';

	constructor(private docCient: DocumentClient) {
		super();
	}

	getItem(id: string): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			// try to get an user; if everything goes well, return the user; if "get" command fails, catch, format and throw exception
			this.docCient.get(
				{
					TableName: this.tableName,
					Key: { id },
				},
				(err, res) => {
					if (err) {
						reject(new ApolloError('An error occurred while trying to fetch user.', ErrorCodes.GET_USER_FAILED, err));
						return;
					}

					// if "get" command returned a user, return it back as well; if res.Item is empty, throw exception telling that the user was not found
					if (res.Item) {
						resolve(res.Item as UserModel);
					} else {
						reject(new ApolloError(`User with ID '${id}' not found.`, ErrorCodes.USER_NOT_FOUND));
					}
				},
			);
		});
	}

	listItems(
		paginationInput?: Maybe<PaginationInput>,
		nameFilter?: Maybe<string>,
	): Promise<PaginationOutputModel<UserModel>> {
		return new Promise<PaginationOutputModel<UserModel>>((resolve, reject) => {
			paginationInput ||= {};

			// if the ID of the last element of the previous pagination was passed, build the exclusiveStartKey to be passed to "scan" command; otherwise, leave it undefined
			const exclusiveStartKey = paginationInput.exclusiveStartId ? { id: paginationInput.exclusiveStartId } : undefined;

			// if filterValue was passed, build the FilterExpression string to be used by DynamoDB during the "scan" command to filter the elements that will be returned, and
			// also build other properties that will be useful in the "scan" command (expressionAttributeValues and expressionAttributeNames); otherwise, leave it undefined.
			const filterExpression = nameFilter ? 'contains (#n, :filterValue)' : undefined; // this filter expression will check if the user name contains the filter value that was passed
			const expressionAttributeValues = nameFilter ? { ':filterValue': nameFilter } : undefined;
			const expressionAttributeNames = nameFilter ? { '#n': 'name' } : undefined;

			// try to list users; if everything goes well, return the the result of the pagination; if the "scan" command fails, catch, format and throw exception
			this.docCient.scan(
				{
					TableName: this.tableName,
					Limit: paginationInput.limit || undefined,
					ExclusiveStartKey: exclusiveStartKey,
					FilterExpression: filterExpression,
					ExpressionAttributeValues: expressionAttributeValues,
					ExpressionAttributeNames: expressionAttributeNames,
				},
				(err, res) => {
					if (err) {
						reject(new ApolloError('An error occurred while trying to list users.', ErrorCodes.LIST_USERS_FAILED, err));
						return;
					}

					if (res.Items === undefined || res.Count === undefined || res.ScannedCount === undefined) {
						reject(
							new ApolloError(
								'Listing users failed: the result of the scan command is invalid.',
								ErrorCodes.LIST_USERS_FAILED,
							),
						);
						return;
					}

					resolve({
						items: res.Items as UserModel[],
						count: res.Count,
						scannedCount: res.ScannedCount,
						lastEvaluatedKey: res.LastEvaluatedKey,
					});
				},
			);
		});
	}

	async putItem(input: UserCreationModel): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			// get current date as UTC to fulfill fields createdAt and updatedAt
			const currentDate = new Date().toUTCString();

			// fulfill some other props of the input, to make it ready to send to Dynamo
			const item: UserModel = {
				...input,
				id: uuidv4(),
				createdAt: currentDate,
				updatedAt: currentDate,
			};

			// try to create user; if everything goes well, return the user; if the "put" command fails, catch, format and throw exception
			this.docCient.put(
				{
					TableName: this.tableName,
					Item: item,
				},
				(err, _res) => {
					if (err) {
						reject(new ApolloError('An error occurred while trying to create user.', ErrorCodes.PUT_USER_FAILED, err));
						return;
					}
					resolve(item);
				},
			);
		});
	}

	async updateItem(id: string, input: UserUpdateModel): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			// get current date as UTC to update the field updatedAt
			const currentDate = new Date().toUTCString();

			// generate the update object that will be passed to docCient.update
			const updateItemInput = buildSimpleUpdateItemInput(this.tableName, id, {
				...input,
				updatedAt: currentDate,
			});

			// try to update user; if everything goes well, return the user; if the "update" command fails, catch, format and throw exception
			this.docCient.update({ ...updateItemInput, ReturnValues: 'ALL_NEW' }, (err, res) => {
				if (err) {
					// since the condition for the update to happen is that the user with the given ID exists (see usage of "ConditionExpression" inside
					// "buildSimpleUpdateItemInput"), if it is not found, an exception with code 'ConditionalCheckFailedException' will be thrown
					if (err.code === 'ConditionalCheckFailedException') {
						reject(
							new ApolloError(
								`User with ID '${id}' not found; hence, update operation failed.`,
								ErrorCodes.USER_NOT_FOUND,
								err,
							),
						);
					} else {
						reject(
							new ApolloError('An error occurred while trying to update user.', ErrorCodes.UPDATE_USER_FAILED, err),
						);
					}
					return;
				}

				// just return the user (inside res.Attributes), since, when set to ALL_NEW, "update" command will either fulfill property "Attributes"
				// and succeed or fail and throw the exceptions above.
				resolve(res.Attributes as UserModel);
			});
		});
	}

	async deleteItem(id: string): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			// try to delete user; if everything goes well, return the user; if the "delete" command fails, catch, format and throw exception
			this.docCient.delete(
				{
					TableName: this.tableName,
					Key: { id },
					ReturnValues: 'ALL_OLD',
				},
				(err, res) => {
					if (err) {
						reject(
							new ApolloError('An error occurred while trying to delete user.', ErrorCodes.DELETE_USER_FAILED, err),
						);
						return;
					}

					// if "delete" command found the user, deleted it, and returned it (res.Attributes is fulfilled), return it back as well;
					// otherwise, if user was not found (res.Attributes is empty), throw exception explaining that.
					if (res.Attributes) {
						resolve(res.Attributes as UserModel);
					} else {
						reject(
							new ApolloError(
								`User with ID '${id}' not found; hence, delete operation failed.`,
								ErrorCodes.USER_NOT_FOUND,
							),
						);
					}
				},
			);
		});
	}
}

export default UserDataSource;
