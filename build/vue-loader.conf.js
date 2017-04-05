var utils = require('./utils') //引入本地工具模块utils.js
var config = require('../config') //引入本地配置模块config/index.js
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap //true
      : config.dev.cssSourceMap, //false
    extract: isProduction
  })
}
