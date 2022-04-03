import { ApolloError, UserInputError } from 'apollo-server-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { User, UserInput } from '../graphql/types/types';
import { mapAttributeToUser } from '../mappers/user.mapper';
import { dateIsValid, formatDateOnly, getCurrentDateStr } from '../utils/date.util';

export class UserService {
  private database: DocumentClient;

  private tableName: string;

  constructor(db: DocumentClient, tableName: string) {
    this.database = db;
    this.tableName = tableName;
  }

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
      return Promise.reject(new ApolloError('Error while getting user'));
    }
  }

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
      return Promise.reject(new ApolloError('Error while creating user'));
    }
  }

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

      return Promise.reject(new ApolloError('Error while updating user'));
    }
  }
}
