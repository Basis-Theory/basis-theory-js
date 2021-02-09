module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        targets: {
          ie: '11',
        },
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    '@babel/proposal-class-properties',
  ],
};
