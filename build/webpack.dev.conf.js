var utils = require('./utils') //引入本地工具模块utils.js
var webpack = require('webpack') //引入webpack工具，用来对资源进行模块化管理和打包
var config = require('../config') //引入本地配置模块config/index.js
var merge = require('webpack-merge') //引入webpack配置合并插件webpack-merge，用来把多个配置对象合并成一个
var baseWebpackConfig = require('./webpack.base.conf') //引入webpack基本配置模块webpack.base.conf.js
var HtmlWebpackPlugin = require('html-webpack-plugin') //引入用来生成html文件的插件html-webpack-plugin
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') //引入错误信息提示插件friendly-errors-webpack-plugin

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) { //Object.keys()返回对象中所有可枚举的属性组成的数组
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]) //concat()方法用于合并两个或多个数组并返回新的数组，该方法不会改变原始数组，执行结果: entry.app = ['./build/dev-client', './src/main.js']
})

module.exports = merge(baseWebpackConfig, { //将dev环境的webpack配置和base配置合并，具体合并方式可以查看webpack-merge插件
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }) //在module.rules中添加多个用来处理css的loader配置对象
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map', //设置webpack构建时的源代码映射模式，使用cheap模式可以大幅提高sourcemap生成的效率，使用eval方式可以大幅提高持续构建效率，使用module可支持babel，使用eval-source-map模式可以减少网络请求，cheap-module-eval-source-map模式虽然速度快但是定位不准，可以换成eval-source-map模式
  plugins: [
    new webpack.DefinePlugin({ //webpack内置插件，DefinePlugin接收字符串插入到代码中，相当于定义全局变量
      'process.env': config.dev.env //process.env.NODE_ENV==='development'
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(), //webpack内置插件，模块热更新，HotModule插件在页面进行变更的时候只会重绘对应的页面模块，不会重绘整个html文件
    new webpack.NoEmitOnErrorsPlugin(), //webpack内置插件，不显示错误信息
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({ //自动生成html
      filename: 'index.html', //生成的html代码放置在哪个文件，即定义生成的html文件名
      template: 'index.html', //以某个html文件为模版生成html文件
      inject: true //有true|'head'|'body'|false四种选项，true和'body'将生成的html代码注入到body标签底部，'head'将生成的html代码注入到head标签中
    }),
    new FriendlyErrorsPlugin() //错误信息提示插件
  ]
})
