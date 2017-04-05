var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径
var config = require('../config') //引入本地配置模块config/index.js
var ExtractTextPlugin = require('extract-text-webpack-plugin') //引入提取css的插件extract-text-webpack-plugin

exports.assetsPath = function (_path) { //根据当前运行环境设置对应的静态资源存放的二级目录
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path) //以posix兼容的交互方式将多个路径结合在一起，并转换为标准化的路径，如path.posix.join('./a', 'b') => '/a/b'
}

exports.cssLoaders = function (options) {
  options = options || {} //如果传入的options为空或undefined，赋值为{}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production', //设置生产环境开启css压缩
      sourceMap: options.sourceMap //设置是否开启css源代码映射
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) { //添加额外的样式相关loader，如style-loader、stylus-loader、sass-loader、less-loader
      loaders.push({
        loader: loader + '-loader', //webpack2中'-loader'后缀默认不能省略
        options: Object.assign({}, loaderOptions, { //Object.assign()方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象，如果有属性相同后面的覆盖前面的
          sourceMap: options.sourceMap //设置是否开启css源代码映射
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) { //判断是否需要提取css到独立文件，生产环境默认为true
      return ExtractTextPlugin.extract({
        use: loaders, //使用到的用来导出css的loaders
        fallback: 'vue-style-loader' //当css样式不提取时使用的loader，当前设置使用vue-style-loader
      })
    } else {
      return ['vue-style-loader'].concat(loaders) //concat()方法用于合并两个或多个数组并返回新的数组，该方法不会改变原始数组
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }), //设置开启语法缩进，因为sass语法没有用{}把代码包起来
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) { //for...in语句用于遍历数组或对象属性
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'), //匹配文件扩展名
      use: loader //使用对应的loader提取css
    })
  }
  return output
}
