const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { merge } = require('webpack-merge');
// eslint-disable-next-line import/extensions
const configs = require('./webpack.common.js');

const dev = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [new BundleAnalyzerPlugin()],
};

module.exports = configs.map((config) => merge(config, dev));
