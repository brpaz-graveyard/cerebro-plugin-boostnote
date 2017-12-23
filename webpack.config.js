
const merge = require('webpack-merge');
const baseConfig = require('./node_modules/cerebro-scripts/config/webpack.config.js');

module.exports = merge(baseConfig, {
  module: {
    rules: [
      { test: /coffee-script\/bin/, loader: 'shebang-loader' }
    ]
  }
});
