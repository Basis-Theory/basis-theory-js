module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0],
    'scope-empty': [2, 'never'],
    'scope-min-length': [2, 'always', 7], // scope must be task id
    'scope-case': [2, 'always', 'uppercase'], // i.e. ENG-270
  },
};
