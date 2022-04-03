import { ApolloError, UserInputError } from 'apollo-server-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import {
  InputMaybe,
  User,
  UserInput,
  UserListResult,
  UserQueryParams,
} from '../graphql/types/types';
import { mapAttributeToUser } from '../mappers/user.mapper';
import { dateIsValid, formatDateOnly, getCurrentDateStr } from '../utils/date.util';

/**
 * Service used to execute crud operations for users
 */
export class UserService {
  private database: DocumentClient;

  private tableName: string;

  /**
   * @param {DocumentClient} db DynamoDb document client
   * @param {string} tableName DynamoDB user's table name
   */
  constructor(db: DocumentClient, tableName: string) {
    this.database = db;
    this.tableName = tableName;
  }

  /**
   * Fetch a user with its Id.
   * @param {string} id The id of the user to fetch
   * @returns A Promise with the user that matches the provided id.
   */
  async getUser(id: string): Promise<User> {
    try {
      const user = await this.database.get({
        TableName: this.tableName,
        Key: { id },
      }).promise();

      if (!user || !user.Item) {
        return Promise.reject(new ApolloError(
          'The user does not exist',
          'NOT_FOUND',
        ));
      }

      return Promise.resolve(mapAttributeToUser(user.Item));
    } catch (error) {
      return Promise.reject(new ApolloError('Error while getting user.'));
    }
  }

  /**
   * Get all users.
   * @param {UserQueryParams} query Query params to apply to users fetch
   * @returns A list of users.
   */
  async getAll(query?: InputMaybe<UserQueryParams>): Promise<UserListResult> {
    try {
      // Set users array as empty.
      let users: User[] = [];
      // Get limit from query or set default of 20.
      const limit = query?.limit ?? 20;

      // Execute the scan
      const scanRes = await this.database.scan({
        TableName: this.tableName,
        // If filter was provided, get all results to apply limit after
        ...(query?.filter ? {} : { Limit: limit }),
        // If cursos was provided, setup start key
        ...(query?.cursor ? { ExclusiveStartKey: { id: query.cursor } } : {}),
        // If filter was provided, apply filter expression
        ...(query?.filter ? {
          FilterExpression: 'contains(#name, :filter)',
          ExpressionAttributeNames: { '#name': 'name' },
          ExpressionAttributeValues: { ':filter': query?.filter },
        } : {}),
      }).promise();

      // If items found, update users array
      if (scanRes.Items) {
        users = scanRes.Items as User[];
      }

      // Get cursor from scan results
      let cursor = scanRes.LastEvaluatedKey?.id ?? undefined;

      // If query was provided, apply limit to match requested results
      if (query?.filter && users.length > limit) {
        // Remove extra results
        while (users.length > limit) {
          users.pop();
        }

        // Get new cursor
        cursor = users[users.length - 1].id;
      }

      return Promise.resolve({ users, cursor });
    } catch (error) {
      return Promise.reject(new ApolloError('Error while getting users.'));
    }
  }

  /**
   * Create a new user.
   * @param {UserInput} data The data to create the user.
   * @returns A Promise with the created user.
   */
  async createUser(data: UserInput): Promise<User> {
    try {
      if (!data.dob || !data.description || !data.name) {
        return Promise.reject(new UserInputError(
          'You must include all mandatory fields.',
        ));
      }

      // Validate provided date
      if (!dateIsValid(data.dob)) {
        return Promise.reject(new UserInputError('The provided date of birth is invalid.'));
      }

      const user: User = {
        id: uuid(),
        createdAt: getCurrentDateStr(),
        description: data.description,
        dob: formatDateOnly(data.dob),
        name: data.name,
        imageUrl: data.imageUrl,
        address: data.address,
      };

      await this.database.put({
        TableName: this.tableName,
        Item: user,
      }).promise();

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(new ApolloError('Error while creating user.'));
    }
  }

  /**
   * Updates an existing user with its Id.
   * @param {string} id The id of the user to update.
   * @param {UserInput} data The new data to update the user.
   * @returns The updated user.
   */
  async updateUser(id: string, data: UserInput): Promise<User> {
    try {
      // Get user if exists
      const user = await this.getUser(id);

      // Validate date if provided
      if (data.dob && !dateIsValid(data.dob)) {
        return Promise.reject(new UserInputError('The provided date of birth is invalid.'));
      }

      const updatedUser: User = {
        id: user.id,
        createdAt: user.createdAt,
        description: data.description ?? user.description,
        dob: (data.dob) ? formatDateOnly(data.dob) : user.dob,
        name: data.name ?? user.name,
        imageUrl: data.imageUrl ?? user.imageUrl,
        address: data.address ?? user.address,
        updatedAt: getCurrentDateStr(),
      };

      await this.database.put({
        TableName: this.tableName,
        Item: updatedUser,
      }).promise();

      return Promise.resolve(updatedUser);
    } catch (error) {
      if (error instanceof ApolloError) {
        return Promise.reject(error);
      }

      return Promise.reject(new ApolloError('Error while updating user.'));
    }
  }

  /**
   * Deletes a user with its Id.
   * @param {string} id The id of the user to delete.
   * @returns A boolean.
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.database.delete({
        TableName: this.tableName,
        Key: { id },
      }).promise();

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(new ApolloError('Error while deleting user.'));
    }
  }
}
