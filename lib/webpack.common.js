const path = require('path');
// const webpack = require('webpack');
const { merge } = require('webpack-merge');
const babelConfig = require('./babel.bundle.config');

const base = {
  target: ['web', 'es6'],
  entry: path.resolve(__dirname, 'src'),

  output: {
    path: path.resolve(__dirname, 'dist'),
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
};

const umd = merge(base, {
  output: {
    filename: 'basis-theory-js.bundle.js',
    library: 'BasisTheory',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  // module: {
  //   rules: [
  //     {
  //       include: [
  //         // the following packages need tranpilation to es5
  //         path.resolve(__dirname, '../node_modules/enc-utils'), // resolve absolute path to the root hoisted modules
  //         path.resolve(__dirname, '../node_modules/buffer'),
  //         path.resolve(__dirname, '../node_modules/eccrypto-js'),
  //       ],
  //       test: /\.(ts|js)x?$/,
  //       loader: 'babel-loader',
  //       options: babelConfig,
  //     },
  //   ],
  // },
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     Buffer: ['buffer', 'Buffer'], // window.Buffer = buffer.Buffer
  //     process: 'process/browser',
  //   }),
  // ],
});

// const package = require('./package.json');
// const esm = merge(base, {
//   output: {
//     filename: 'basis-theory-js.esm.js',
//   },
//   externals: Object.keys(package.dependencies),
// });

module.exports = [
  umd,
  // esm
];
