module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/ban-types': ['error', {'types': {'{}': false}}], // graphql-codegen generates a file with a bunch of {}
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/no-unused-vars': ['warn', {'argsIgnorePattern': '^_'}],
    'semi': ['error'],
  },
  settings: {},
};
