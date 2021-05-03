module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	modulePathIgnorePatterns: ['./tests/integration/.aws-sam'],
	testTimeout: 600000,
}
