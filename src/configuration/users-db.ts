import { ApolloError } from 'apollo-server-lambda';

export const usersTableEnvName = 'USERS_TABLE_NAME';
export const nameIndexEnvName = 'NAME_INDEX';

export interface UsersDBConfiguration {
	tableName: string;
	nameIndex: string;
}

export const configureUsersDB = (): UsersDBConfiguration => {
	const tableName = process.env[usersTableEnvName];

	if (!tableName) {
		throw new ApolloError('No users table name provided');
	}

	const nameIndex = process.env[nameIndexEnvName];

	if (!nameIndex) {
		throw new ApolloError('No name index provided');
	}

	return {
		nameIndex,
		tableName,
	};
};
