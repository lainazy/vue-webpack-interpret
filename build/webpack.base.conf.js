var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径
var utils = require('./utils') //引入本地工具模块utils.js
var config = require('../config') //引入本地配置模块config/index.js
var vueLoaderConfig = require('./vue-loader.conf') //引入本地vue-loader配置模块vue-loader.conf.js

function resolve (dir) {
  return path.join(__dirname, '..', dir) //返回当前文件所在目录的上级目录+dir路径，Node.js变量:__dirname:当前文件所在目录的完整绝对路径
}

module.exports = {
  entry: { //webpack打包入口文件配置
    app: './src/main.js' //将输出的文件名改成app，默认为main
  },
  output: { //webpack打包输出结果配置
    path: config.build.assetsRoot, //输出的静态资源存放根路径
    filename: '[name].js', //输出的文件名，name取自chunk的name，通常为entry对象的key
    publicPath: process.env.NODE_ENV === 'production' //发布的根路径
      ? config.build.assetsPublicPath //'/'
      : config.dev.assetsPublicPath //'/'
  },
  resolve: { //webpack模块解析规则配置，不适用于对loader的解析
    extensions: ['.js', '.vue', '.json'], //模块的扩展名，引入模块的时候可以不写扩展名，会自动添加这些扩展名
    alias: { //模块的别名列表
      'vue$': 'vue/dist/vue.esm.js', //给vue/dist/vue.esm.js模块取别名为vue，这样引入时就可以直接引入别名vue，如import Vue from 'vue'
      '@': resolve('src'), //给src目录的完整绝对路径取别名为@
    }
  },
  module: {
    rules: [ //模块规则配置
      {
        test: /\.(js|vue)$/, //匹配条件，约定了提供一个正则或正则数组，非强制，此处匹配.js和.vue结尾的文件
        loader: 'eslint-loader', //匹配成功后使用eslint-loader，用于审查js和vue文件及include选项包含路径中的文件
        enforce: "pre", //指定loader种类为前置，loader执行顺序为preLoader -> 普通loader -> postLoader
        include: [resolve('src'), resolve('test')], //匹配条件，约定了提供一个字符串或字符串数组，字符串为目录或文件的绝对路径，非强制，此处匹配src目录和test目录
        options: { //eslint-loader的配置选项
          formatter: require('eslint-friendly-formatter') //设置生成的报告的格式，引入格式化插件eslint-friendly-formatter
        }
      },
      {
        test: /\.vue$/, //匹配条件，约定了提供一个正则或正则数组，非强制，此处匹配.vue结尾的文件
        loader: 'vue-loader', //匹配成功后使用vue-loader，用于加载.vue文件并转换成js(模块)代码输出
        options: vueLoaderConfig //vue-loader的配置选项，此处配置了各种css相关的loader
      },
      {
        test: /\.js$/, //匹配条件，约定了提供一个正则或正则数组，非强制，此处匹配.js结尾的文件
        loader: 'babel-loader', //匹配成功后使用babel-loader，用于加载.js文件并将es2015语法的代码转换成es5语法的代码输出
        include: [resolve('src'), resolve('test')] //匹配条件，约定了提供一个字符串或字符串数组，字符串为目录或文件的绝对路径，非强制，此处匹配src目录和test目录
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, //匹配条件，约定了提供一个正则或正则数组，非强制，此处匹配.js结尾的文件，此处匹配常见的几种图片格式文件
        loader: 'url-loader', //匹配成功后使用url-loader，用于加载这几种图片格式文件并转换成js(base64形式)代码输出
        query: { //url-loader的配置选项，query仅为了保持webpack1的兼容性，建议使用options代替
          limit: 10000, //设置图片文件大小限制为10000Bytes，不超过该大小的图片文件才会被打包成base64形式
          name: utils.assetsPath('img/[name].[hash:7].[ext]') //自定义输出的文件名，只有大于10000Bytes的图片文件才会被独立输出
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, //匹配条件，约定了提供一个正则或正则数组，非强制，此处匹配.js结尾的文件，此处匹配常见的几种字体格式文件
        loader: 'url-loader', //匹配成功后使用url-loader，用于加载这几种字体格式文件并转换成js(base64形式)代码输出
        query: { //url-loader的配置选项，query仅为了保持webpack1的兼容性，建议使用options代替
          limit: 10000, //设置字体文件大小限制为10000Bytes，不超过该大小的字体文件才会被打包成base64形式
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]') //自定义输出的文件名，只有大于10000Bytes的字体文件才会被独立输出
        }
      }
    ]
  }
}
