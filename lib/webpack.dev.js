const { merge } = require('webpack-merge');
const configs = require('./webpack.common.js');

const dev = {
  mode: 'development',
  devtool: 'source-map',
};

module.exports = configs.map((config) => merge(config, dev));
