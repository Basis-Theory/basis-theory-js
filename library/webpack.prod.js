const { merge } = require('webpack-merge');
// eslint-disable-next-line import/extensions
const configs = require('./webpack.common.js');

const prod = {
  mode: 'production',
};

module.exports = configs.map((config) => merge(config, prod));
