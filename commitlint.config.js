module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [2, 'never'],
    'header-min-length': [2, 'never'],
  }
};
