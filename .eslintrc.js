// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true, //设置当前.eslintrc.js文件为eslint根配置文件，如果上级目录中还有.eslintrc.js文件，将会忽略那些文件中的配置
  parser: 'babel-eslint', //设置语法分析器为babel-eslint
  parserOptions: { //语法分析器配置
    sourceType: 'module' //设置源代码类型，有script(默认)和module两种值，设置成module说明代码是写在es2015的模块中，可以直接使用import和export来导入导出模块
  },
  env: { //运行环境配置
    browser: true, //表示代码支持运行在浏览器环境中，另外还可以设置node: true，表示代码支持运行在node环境中
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard', //设置eslint校验规则为标准，eslint-config-前缀可以被忽略
  // required to lint *.vue files
  plugins: [ //插件列表配置
    'html' //eslint-plugin-前缀可以被忽略
  ],
  // add your custom rules here
  'rules': { //自定义规则配置，off/0表示关闭校验，warn/1表示校验不通过时提示警告，error/2表示校验不通过时提示错误
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
