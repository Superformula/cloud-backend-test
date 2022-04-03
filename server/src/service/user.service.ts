import { ApolloError, UserInputError } from 'apollo-server-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { v4 as uuid } from 'uuid';
import { User, UserInput } from '../graphql/types/types';
import { dateIsValid, formatDateOnly, getCurrentDateStr } from '../utils/date.util';

export class UserService {
  private database: DocumentClient;

  private tableName: string;

  constructor(db: DocumentClient, tableName: string) {
    this.database = db;
    this.tableName = tableName;
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
}
