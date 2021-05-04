module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testTimeout: 600000,
	modulePathIgnorePatterns: ['tests/unit', 'tests/integration/.aws-sam'],
}
