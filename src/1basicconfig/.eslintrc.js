/*
官网参考: https://webpack.docschina.org/plugins/eslint-webpack-plugin/
eslint插件:
  目的: 在开发和构建过程中自动化地执行代码质量和风格检查, 如代码检查,代码风格,自动化和集成等
  使用方式:
    a. 按照eslint和eslint的webpack插件
    b. 在webpack.config.js中配置eslint插件,指定文件根目录
    c. 此时还需要新建.eslintrc.js配置文件, 否则会报错

  后续使用: 打包的时候会检查, 如果有语法错误会报错, 当然可以提前安装vscode的eslint插件提前解决语法错误.
*/
module.exports = {
  // 继承 Eslint 规则
  extends: ["eslint:recommended"],
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  parserOptions: {
    ecmaVersion: 6, // es6
    sourceType: "module", // es module
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
  },
}
