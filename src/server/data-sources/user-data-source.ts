import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DataSource } from 'apollo-datasource';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-server-errors';
import { Maybe, PaginationInput } from '../graphql/types';
import { ErrorCodes } from '../enums/error-codes';
import { buildSimpleUpdateItemInput } from '../misc/utils';
import { UserCreationModel, UserModel, UserUpdateModel } from '../data-source-models/user-models';
import { PaginationOutputModel } from '../data-source-models/pagination-output-model';

export const conditionalCheckFailedErrorCode = 'ConditionalCheckFailedException';

export class UserDataSource extends DataSource {
	private readonly tableName = 'Users';

	constructor(private docCient: DocumentClient) {
		super();
	}

	getItem(id: string): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			console.log(`[UserDataSource] - Getting user whose ID is "${id}".`);

			// try to get an user; if everything goes well, return the user; if "get" command fails, catch, format and throw exception
			this.docCient.get(
				{
					TableName: this.tableName,
					Key: { id },
				},
				(err, res) => {
					if (err) {
						const apolloError = new ApolloError(
							'[UserDataSource] - An error occurred while trying to fetch user.',
							ErrorCodes.GET_USER_FAILED,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
						return;
					}

					// if "get" command returned a user, return it back as well; if res.Item is empty, throw exception telling that the user was not found
					if (res.Item) {
						console.log(`[UserDataSource] - Successfully fetched user whose ID is "${id}".`);
						resolve(res.Item as UserModel);
					} else {
						const apolloError = new ApolloError(
							`[UserDataSource] - User with ID '${id}' not found.`,
							ErrorCodes.USER_NOT_FOUND,
						);
						console.error(apolloError);
						reject(apolloError);
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

			console.log(
				`[UserDataSource] - Listing users with the following params: nameFilter ("${nameFilter}") and paginationInput: `,
				paginationInput,
			);

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
						const apolloError = new ApolloError(
							'[UserDataSource] - An error occurred while trying to list users.',
							ErrorCodes.LIST_USERS_FAILED,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
						return;
					}

					if (res.Items === undefined || res.Count === undefined || res.ScannedCount === undefined) {
						const apolloError = new ApolloError(
							'[UserDataSource] - The response of the "scan" command is invalid, thus operation to list users failed.',
							ErrorCodes.INVALID_SCAN_RESPONSE,
						);
						console.error(apolloError);
						reject(apolloError);
						return;
					}

					console.log('[UserDataSource] - Successfully fetched list of users.');

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
			console.log(`[UserDataSource] - Creating user with name "${input.name}".`);

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
						const apolloError = new ApolloError(
							`[UserDataSource] - An error occurred while trying to create user with name ${item.name}.`,
							ErrorCodes.PUT_USER_FAILED,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
						return;
					}

					console.log(`[UserDataSource] - Successfully created user with name "${item.name}".`);
					resolve(item);
				},
			);
		});
	}

	async updateItem(id: string, input: UserUpdateModel): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			console.log(`[UserDataSource] - Updating user whose ID is "${id}".`);

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
					if (err.code === conditionalCheckFailedErrorCode) {
						const apolloError = new ApolloError(
							`[UserDataSource] - User with ID '${id}' not found; hence, update operation failed.`,
							ErrorCodes.USER_NOT_FOUND,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
					} else {
						const apolloError = new ApolloError(
							'[UserDataSource] - An error occurred while trying to update user.',
							ErrorCodes.UPDATE_USER_FAILED,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
					}
					return;
				}

				// just return the user (inside res.Attributes), since, when set to ALL_NEW, "update" command will either fulfill property "Attributes"
				// and succeed or fail and throw the exceptions above.
				console.log(`[UserDataSource] - Successfully updated user whose ID is "${id}".`);
				resolve(res.Attributes as UserModel);
			});
		});
	}

	async deleteItem(id: string): Promise<UserModel> {
		return new Promise<UserModel>((resolve, reject) => {
			console.log(`[UserDataSource] - Deleting user whose ID is "${id}".`);

			// try to delete user; if everything goes well, return the user; if the "delete" command fails, catch, format and throw exception
			this.docCient.delete(
				{
					TableName: this.tableName,
					Key: { id },
					ReturnValues: 'ALL_OLD',
				},
				(err, res) => {
					if (err) {
						const apolloError = new ApolloError(
							'[UserDataSource] - An error occurred while trying to delete user.',
							ErrorCodes.DELETE_USER_FAILED,
							err,
						);
						console.error(apolloError);
						reject(apolloError);
						return;
					}

					// if "delete" command found the user, deleted it, and returned it (res.Attributes is fulfilled), return it back as well;
					// otherwise, if user was not found (res.Attributes is empty), throw exception explaining that.
					if (res.Attributes) {
						console.log(`[UserDataSource] - Successfully deleted user whose ID is "${id}".`);
						resolve(res.Attributes as UserModel);
					} else {
						const apolloError = new ApolloError(
							`User with ID '${id}' not found; hence, delete operation failed.`,
							ErrorCodes.USER_NOT_FOUND,
						);
						console.error(apolloError);
						reject(apolloError);
					}
				},
			);
		});
	}
}

export default UserDataSource;
