var chalk = require('chalk') //引入粉笔模块chalk，用来突出显示指定的输出信息
var semver = require('semver') //引入版本管理模块semver
var packageConfig = require('../package.json') //引入Node.js包描述文件package.json

function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim() //执行cmd命令，并返回结果，结果进行字符串转换并去除首尾空白
}

var versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version), //去除当前返回的node版本号的多余字符，如：v6.9.5 => 6.9.5
    versionRequirement: packageConfig.engines.node
  },
  {
    name: 'npm',
    currentVersion: exec('npm --version'), //执行exec方法返回npm版本号
    versionRequirement: packageConfig.engines.npm
  }
]

module.exports = function () {
  var warnings = []
  for (var i = 0; i < versionRequirements.length; i++) {
    var mod = versionRequirements[i]
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) { //判断当前node，npm版本是否符合package.json中的要求
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' + //以红色字体显示当前node，npm版本号
        chalk.green(mod.versionRequirement) //以绿色字体显示package.json中要求的版本号
      )
    }
  }

  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:')) //以黄色字体输出信息
    console.log()
    for (var i = 0; i < warnings.length; i++) {
      var warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1) //退出进程，并设置err.code为1，code(1: 未捕获的致命异常)
  }
}
