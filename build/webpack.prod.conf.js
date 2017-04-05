var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径
var utils = require('./utils') //引入本地工具模块utils.js
var webpack = require('webpack') //引入webpack工具，用来对资源进行模块化管理和打包
var config = require('../config') //引入本地配置模块config/index.js
var merge = require('webpack-merge') //引入webpack配置合并插件webpack-merge，用来把多个配置对象合并成一个
var baseWebpackConfig = require('./webpack.base.conf') //引入webpack基本配置模块webpack.base.conf.js
var CopyWebpackPlugin = require('copy-webpack-plugin') //引入用来拷贝资源(文件和文件夹)的插件copy-webpack-plugin
var HtmlWebpackPlugin = require('html-webpack-plugin') //引入用来自动生成html文件并注入到.html文件中的插件html-webpack-plugin
var ExtractTextPlugin = require('extract-text-webpack-plugin') //引入用来提取css到独立文件的插件extract-text-webpack-plugin
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') //引入用来优化和压缩css的插件optimize-css-assets-webpack-plugin

var env = process.env.NODE_ENV === 'testing' //理论上此处判断为false，并没有发现会使结果判断为true的情况，test时也不会引用到当前文件，可能是为了考虑手动修改而添加
  ? require('../config/test.env') //env.NODE_ENV==='testing'
  : config.build.env //env.NODE_ENV==='production'

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ //在module.rules中添加多个用来处理css的loader配置对象
      sourceMap: config.build.productionSourceMap, //true
      extract: true //开启提取css功能，将css提取到独立文件
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false, //设置webpack构建时的源代码映射模式
  output: { //webpack打包输出结果配置
    path: config.build.assetsRoot, //输出的静态资源存放根路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), //输出的文件名，name取自chunk的name，通常为entry对象的key，chunkhash取自chunk的hash
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') //输出的非入口文件的文件名，id取自chunk的id，chunkhash取自chunk的hash，在进行代码分割(require.ensure())用来按需加载(异步)模块时会用到
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({ //webpack内置插件，DefinePlugin接收字符串插入到代码中，相当于定义全局变量
      'process.env': env //process.env.NODE_ENV==='production'
    }),
    new webpack.optimize.UglifyJsPlugin({ //webpack内置优化插件，js代码压缩
      compress: { //压缩配置
        warnings: false //不输出警告信息
      },
      sourceMap: true //开启错误信息源代码映射，默认为true
    }),
    // extract css into its own file
    new ExtractTextPlugin({ //提取css
      filename: utils.assetsPath('css/[name].[contenthash].css') //提取的css放置在哪个文件，name取自chunk的name，contenthash取自content的hash(应该是随机生成)
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(), //优化压缩css，压缩提取出来的css，可以删除来自不同组件的冗余代码
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({ //自动生成html
      filename: process.env.NODE_ENV === 'testing' //生成的html代码放置在哪个文件，即定义生成的html文件名
        ? 'index.html'
        : config.build.index, //输出的index.html的绝对路径
      template: 'index.html', //以某个html文件为模版生成html文件
      inject: true, //有true|'head'|'body'|false四种选项，true和'body'将生成的html代码注入到body标签底部，'head'将生成的html代码注入到head标签中
      minify: { //最小化输出配置
        removeComments: true, //删除html注释
        collapseWhitespace: true, //去除html代码间的空白
        removeAttributeQuotes: true //删除属性可删除的""符号，如class="red" => class=red，class="red blue" => class="red blue"
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency' //自动生成的html文件中引入代码块(chunks)的排序模式，有4种模式:'none'|'auto'|'dependency'|{function}，默认为auto
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({ //webpack内置优化插件，将公共js代码分割(提取)到独立文件(公共chunk)
      name: 'vendor', //公共代码块(chunk)的名字，是chunk的唯一标识符
      minChunks: function (module, count) { //有3种值:(number|Infinity|function(module, count) -> boolean)，number表示将被引用次数不低于该number的模块提取到公共chunk中；Infinity表示生成公共chunk，但不提取公共模块到其中；function表示自定义模块提取逻辑，返回true的模块都会被提取到公共chunk中
        // any required modules inside node_modules are extracted to vendor
        return ( //node_modules中的任何所需模块都提取到vendor
          module.resource && //判断模块是否是一个路径
          /\.js$/.test(module.resource) && //判断路径是否以.js结尾
          module.resource.indexOf( //判断路径是否是node_modules的路径
            path.join(__dirname, '../node_modules') //当前文件所在目录的上级目录+node_modules路径，Node.js变量:__dirname:当前文件所在目录的完整绝对路径
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({ //webpack内置优化插件，将webpack运行时代码和模块清单提取到独立的文件(公共chunk)，以防止当app包更新时导致公共代码块vender的hash也更新，webpack运行时代码和模块清单(模块加载代码)总会被提取到最后一个新生成的chunk中
      name: 'manifest', //公共代码块(chunk)的名字，是chunk的唯一标识符
      chunks: ['vendor'] //用来提取公共chunk的源chunks，默认为所有的entry chunks
    }),
    // copy custom static assets
    new CopyWebpackPlugin([ //拷贝静态资源
      {
        from: path.resolve(__dirname, '../static'), //静态资源的源路径
        to: config.build.assetsSubDirectory, //拷贝生成的静态资源存放的根路径
        ignore: ['.*'] //忽视匹配的文件或目录，此处表示所有的.开头文件都不会被拷贝，如.gitkeep
      }
    ])
  ]
})

if (config.build.productionGzip) { //开启gzip压缩时，给webpack plugins添加compression-webpack-plugin插件，false
  var CompressionWebpackPlugin = require('compression-webpack-plugin') //引入用来进行压缩的插件compression-webpack-plugin

  webpackConfig.plugins.push( //添加插件到plugins配置项中，在webpack构建过程中会被使用的插件都要添加到plugins中
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', //目标资源名，其实就是给压缩后的文件添加.gz后缀
      algorithm: 'gzip', //使用gzip算法压缩，默认值为gzip
      test: new RegExp( //匹配需要进行压缩的文件
        '\\.(' +
        config.build.productionGzipExtensions.join('|') + //js|css
        ')$'
      ),
      threshold: 10240, //压缩门槛，大于10240bytes的文件才会被压缩，默认值为0
      minRatio: 0.8 //压缩率，至少能达到0.8的文件才会被压缩，默认值为0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) { //开启包分析时，给webpack plugins添加webpack-bundle-analyzer插件
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin //引入用来生成包分析报告的插件webpack-bundle-analyzer
  webpackConfig.plugins.push(new BundleAnalyzerPlugin()) //添加插件到plugins配置项中，在webpack构建过程中会被使用的插件都要添加到plugins中
}

module.exports = webpackConfig //导出webpack配置
