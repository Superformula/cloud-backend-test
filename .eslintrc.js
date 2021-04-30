module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		semi: [2, 'always'],
		'@typescript-eslint/no-var-requires': [0],
		'@typescript-eslint/no-explicit-any': [0],
	},
	settings: {},
};
