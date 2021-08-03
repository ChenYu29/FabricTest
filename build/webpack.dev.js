const styleRules = require('./rules/styleRules');

const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [...styleRules('dev')],
  },
  devtool: 'cheap-module-source-map'
});
