import { UserInput } from '../../graphql/types/schema-types';
import { UserModel } from '../models/user';
import AWS from 'aws-sdk';
import { UserInputError } from 'apollo-server-errors';
import moment from 'moment';
import validator from 'validator';
import { v4 as uuid } from 'uuid';
import { ApolloError } from 'apollo-server-lambda';

export interface UserRepository {
	createUser(data: UserInput): Promise<UserModel>;
	getUser(id: string): Promise<UserModel>;
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
		if (!data.dob) {
			throw new UserInputError('The date of birth must be specified');
		}

		if (!data.address) {
			throw new UserInputError('The address must be specified');
		}

		if (!data.name) {
			throw new UserInputError('The name must be specified');
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

	updateUser(id: String, data: UserInput): UserModel {
		const validatedInput = this.validateInput(data);

		const user = {
			id: uuid(),
			name: data.name,
			address: data.address,
			description: data.description,
			dob: validatedInput.formattedDateOfBirth,
			createdAt: moment().toISOString(),
		} as UserModel;

		return user;
	}

	private validateInput(data: UserInput): ValidatedInput {
		let parsedBirthDate: moment.Moment | null = null;

		if (data.dob) {
			parsedBirthDate = moment(data.dob);
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
