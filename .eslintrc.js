module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended', // compatibility ruleset (js x ts)
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'prettier/prettier': ['warn'],
  },
  overrides: [
    {
      files: '*.js',
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // js files must be able to require('')
      },
    },
  ],
};
