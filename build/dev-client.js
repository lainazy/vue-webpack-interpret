/* eslint-disable */
require('eventsource-polyfill') //引入用于在低版本浏览器接收服务器发送的事件通知的垫片插件，Html5中的EventSource对象用于接收服务器发送的事件通知
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true') //引入热重载中间件webpack-hot-middleware，?后面是传入的配置选项，noInfo=true表示不输出打印信息，reload=true表示webpack打包完成时自动重载

hotClient.subscribe(function (event) { //订阅事件
  if (event.action === 'reload') {
    window.location.reload() //重载当前页面
  }
})
