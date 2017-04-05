require('./check-versions')() //引入本地模块check-versions.js并执行

process.env.NODE_ENV = 'production' //设置环境变量

var ora = require('ora') //引入loading插件
var rm = require('rimraf') //引入可以在node中执行rm -rf命令的插件，用来删除资源
var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径
var chalk = require('chalk') //引入粉笔模块chalk，用来突出显示指定的输出信息
var webpack = require('webpack') //引入webpack工具，用来对资源进行模块化管理和打包，这是构建该项目的核心工具
var config = require('../config') //引入本地配置模块config/index.js
var webpackConfig = require('./webpack.prod.conf') //引入本地生产环境webpack配置模块webpack.prod.conf.js

var spinner = ora('building for production...') //在终端显示的loading提示效果
spinner.start() //开始显示loading提示

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => { //rm(f, [opts,] callback)，删除f路径匹配的资源，删除完成或出错时调用callback，此处f为dist/static目录的绝对路径
  if (err) throw err //若出错则抛出err信息并终止进程
  webpack(webpackConfig, function (err, stats) { //webpack(options, callback)，执行webpack构建，构建完成或出错时调用callback
    spinner.stop() //停止并清理loading提示
    if (err) throw err //若出错则抛出err信息并终止进程
    process.stdout.write(stats.toString({ //process模块的标准输出方法，write等同于console.log
      colors: true, //stats统计模块的配置项
      modules: false, //stats统计模块的配置项
      children: false, //stats统计模块的配置项
      chunks: false, //stats统计模块的配置项
      chunkModules: false //stats统计模块的配置项
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n')) //以青色字体输出
    console.log(chalk.yellow( //以黄色字体输出
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
