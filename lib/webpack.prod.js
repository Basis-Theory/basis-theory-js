const { merge } = require('webpack-merge');
const configs = require('./webpack.common.js');

const prod = {
  mode: 'production',
};

module.exports = configs.map((config) => merge(config, prod));
