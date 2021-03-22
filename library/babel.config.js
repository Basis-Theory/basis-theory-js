// this file is used to transpile Typescript files into Javascript files (dist/*)
// for ES module usage
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '10',
        },
      },
    ],
    '@babel/typescript',
  ],
  plugins: ['@babel/proposal-class-properties'],
};