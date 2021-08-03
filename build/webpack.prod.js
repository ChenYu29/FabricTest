const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const styleRules = require('./rules/styleRules');
const productionPlugin = require('./plugins/productionPlugin');
const optimization = require('./optimization');
// 压缩代码
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [...styleRules('prod')],
  },
  plugins: [...productionPlugin],
  optimization: {
    ...optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        exclude: /[\\/]node_modules[\\/]/,
        parallel: true,
        extractComments: false
      })
    ]
  }
});
