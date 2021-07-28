// this Babel configuration is used in webpack library bundle
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '>0.25%',
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/proposal-class-properties',
    'babel-plugin-transform-typescript-metadata',
  ],
};
