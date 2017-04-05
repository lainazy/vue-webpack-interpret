// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path') //引入Node.js自带的工具模块path，用来处理文件路径

module.exports = {
  build: {
    env: require('./prod.env'), //设置环境变量的NODE_ENV属性值，引入本地模块prod.env.js
    index: path.resolve(__dirname, '../dist/index.html'), //设置入口文件的完整绝对路径，Node.js变量:__dirname:当前文件所在目录的完整绝对路径
    assetsRoot: path.resolve(__dirname, '../dist'), //设置webpack打生产包生成的静态资源文件存放的根目录，Node.js变量:__dirname:当前文件所在目录的完整绝对路径
    assetsSubDirectory: 'static', //设置webpack打生产包生成的静态资源文件存放的二级目录
    assetsPublicPath: '/', //设置生产环境发布路径的根目录
    productionSourceMap: true, //设置开启源代码映射
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, //设置关闭gzip压缩，因为很多流行的静态资源主机，如Surge、Netlify已经为所有静态资源开启gzip压缩，如果要开启gzip压缩，确保先安装compression-webpack-plugin插件
    productionGzipExtensions: ['js', 'css'], //设置需要gzip压缩的文件扩展名
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report //设置收集分析报告的功能，运行npm run build --report，可以在打包完成时生成包分析报告
  },
  dev: {
    env: require('./dev.env'), //设置环境变量的NODE_ENV属性值，引入本地模块dev.env.js
    port: 8080, //设置端口号
    autoOpenBrowser: true, //设置开启自动打开浏览器的功能
    assetsSubDirectory: 'static', //设置webpack打dev包生成的静态资源文件存放的二级目录
    assetsPublicPath: '/', //设置dev环境发布路径的根目录
    proxyTable: {}, //设置代理地址映射表，可以用来解决dev环境跨越问题
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false //设置关闭css源代码映射，因为使用相对路径会报错
  }
}
