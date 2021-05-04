import { configureUsersDB, nameIndexEnvName, usersTableEnvName } from './users-db';

const testTableName = 'TestUserTable';
const testNameIndex = 'TestNameIndex';
describe('Test user database configuration', () => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		process.env = { ...OLD_ENV }; // We want to reset process.env state while calling each test
	});

	it('Should be created if users table environment variable is set', () => {
		process.env[usersTableEnvName] = testTableName;
		process.env[nameIndexEnvName] = testNameIndex;
		const config = configureUsersDB();
		expect(config).toBeDefined();
		expect(config.nameIndex).toBe(testNameIndex);
		expect(config.tableName).toBe(testTableName);
	});

	it('Should throw error if users table environment variable is not set', () => {
		process.env[usersTableEnvName] = undefined;
		process.env[nameIndexEnvName] = testNameIndex;
		try {
			configureUsersDB();
			fail();
		} catch (error) {
			expect(error.message).toBe('No users table name provided');
		}
	});

	it('Should throw error if name index environment variable is not set', () => {
		process.env[usersTableEnvName] = testTableName;
		process.env[nameIndexEnvName] = undefined;
		try {
			configureUsersDB();
			fail();
		} catch (error) {
			expect(error.message).toBe('No name index provided');
		}
	});
});
