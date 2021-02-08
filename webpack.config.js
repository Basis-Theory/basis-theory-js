const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: ['web', 'es5'],
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src'),

  output: {
    filename: 'basis-theory-js.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      // crypto: require.resolve('crypto-browserify'),
      // stream: require.resolve('stream-browserify')
      crypto: false,
      stream: false,
    },
  },

  module: {
    rules: [
      {
        include: [
          path.resolve(__dirname, 'src'),
          // the following packages need tranpilatio to es5
          path.resolve(__dirname, 'node_modules/enc-utils'),
          path.resolve(__dirname, 'node_modules/buffer'),
          path.resolve(__dirname, 'node_modules/eccrypto-js'),
        ],
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};
