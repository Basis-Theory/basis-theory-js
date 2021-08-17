const path = require('path');
const Dotenv = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const babelConfig = require('./babel.bundle.config');

const base = {
  target: ['web', 'es6'],
  entry: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    globalObject: "typeof self !== 'undefined' ? self : this",
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      crypto: false,
      stream: false,
    },
  },

  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'src')],
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  },

  plugins: [new Dotenv()],
};

const umd = merge(base, {
  output: {
    filename: 'basis-theory-js.bundle.js',
    library: 'BasisTheory',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
});

module.exports = [
  umd,
  // other configs like `cjs` or `esm` could go here
];
