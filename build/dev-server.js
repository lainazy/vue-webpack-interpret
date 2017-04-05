require('./check-versions')() //引入本地模块check-versions.js并执行

var config = require('../config') //引入本地配置模块config/index.js
if (!process.env.NODE_ENV) { //首次执行该代码时，process.env.NODE_ENV为undefined
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV) //初始化process.env.NODE_ENV==='development'
}

var opn = require('opn') //引入模块opn，可以用来处理各种open操作，如打开图片、网址、文件等，此处引入用来打开浏览器并跳转到指定url
var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径
var express = require('express') //引入express框架，可以用来快速搭建web应用
var webpack = require('webpack') //引入webpack工具，用来对资源进行模块化管理和打包，这是构建该项目的核心工具
var proxyMiddleware = require('http-proxy-middleware') //引入代理地址映射模块http-proxy-middleware，用来在dev环境做地址代理，可以解决跨域问题
var webpackConfig = process.env.NODE_ENV === 'testing' //理论上此处判断为false，e2e测试时为true
  ? require('./webpack.prod.conf') //引入本地生产环境webpack配置模块webpack.prod.conf.js
  : require('./webpack.dev.conf') //引入本地dev环境webpack配置模块webpack.dev.conf.js

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port //端口号，8080
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser //自动打开浏览器，true
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable //http代理配置，{}

var app = express() //启动express服务
var compiler = webpack(webpackConfig) //启动webpack编译

var devMiddleware = require('webpack-dev-middleware')(compiler, { //引入热重载相关中间件webpack-dev-middleware，该中间件可以将编译后的文件暂存到内存中，需要配合webpack-hot-middleware中间件使用，并通过express来实际操作
  publicPath: webpackConfig.output.publicPath, //热重载发布的根路径，此路径需要与webpack配置的发布根路径保持一致
  quiet: true //沉默，热重载时是否在控制台打印信息，true表示不打印
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, { //引入热重载中间件webpack-hot-middleware，通过express来实际操作
  log: () => {} //设置用来打印日志的function，默认使用console.log()，此处表示不打印，和设置成false类似
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) { //当一个compilation实例创建的时候执行function，在webpack中间件运行时，每当一个文件发生改变时就会产生一个新的compilation实例
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) { //当html-webpack-plugin-after-emit事件(钩子)触发时执行function，该事件在生成html文件完成后由html-webpack-plugin插件触发
    hotMiddleware.publish({ action: 'reload' }) //通过webpack-hot-middleware插件发布重载事件，在dev-client.js中会订阅webpack-hot-middleware插件发布的所有事件，当发现重载事件发布时会执行页面重载
    cb() //执行回调，通知异步已经执行完成
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) { //Object.keys()返回对象中所有可枚举的属性组成的数组
  var options = proxyTable[context] //获取对应属性的属性值
  if (typeof options === 'string') {
    options = { target: options } //将获取到的属性值转换成http-proxy-middleware中间件需要的参数格式
  }
  app.use(proxyMiddleware(options.filter || context, options)) //通过express来使用http-proxy-middleware中间件，将proxyTable中的请求配置挂在到启动的express服务上
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')()) //引入模块connect-history-api-fallback，并通过express来使用，该模块用来匹配资源(即请求路径:req.url)，格式如：{rewrites:[{from:/^\/index$/,to:'/index.html'}]}，如果req.url匹配from值成功则重写req.url为to值，然后继续请求，此处没有定义options.rewrites就相当于跳过重写，req.url使用默认值，req.url默认值为'/index.html'，可通过options.index选项修改

// serve webpack bundle output
app.use(devMiddleware) //将暂存到内存中的webpack编译后的文件挂在启动的express服务上，app.use([path,] function [, function...])，当没有path参数时，表示匹配所有请求

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware) //将hot-reload挂在启动的express服务上，app.use([path,] function [, function...])，当没有path参数时，表示匹配所有请求

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory) //拼接static目录的静态资源路径，以posix兼容的交互方式将多个路径结合在一起，并转换为标准化的路径，如path.posix.join('./a', 'b') => '/a/b'
app.use(staticPath, express.static('./static')) //app.use([path,] function [, function...])，当没有path参数时，表示匹配所有请求；express.static(root, [options])，负责托管Express应用内的静态资源，root参数指的是静态资源文件所在的根目录

var uri = 'http://localhost:' + port //本地地址+端口号:8080

devMiddleware.waitUntilValid(function () { //waitUntilValid(callback)，当中间件起效或重新起效时调用callback
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) { //app.listen(port, [hostname], [backlog], [callback])，监听post端口，当监听的端口启用时调用callback，若忽略hostname则表示接受任意的本地IPv4地址(INADDR_ANY)的请求
  if (err) { //出错时输出错误信息并终止
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri) //打开默认浏览器并跳转链接到'http://localhost:8080'
  }
})
