const path = require("path") // nodejs核心模块，专门用来处理路径问题
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  // 1 入口
  entry: "./src/main.js", // 相对路径
  // 2 输出
  output: {
    // 所有文件的输出路径
    path: path.resolve(__dirname, "../dist"), // 绝对路径
    // 入口文件打包输出文件名
    filename: "static/js/main.js",
    // 新增: 在打包前清空上次打包内容, webpack5不再需要引入专门的插件来处理
    clean: true,
  },
  // 3 加载器
  module: {
    rules: [
      /*
      loader的配置, 关于use和loader的几个注意点: 
        a. use可以使用多个Loader, 而loader: 'xxx' 只能使用1个loader
        b. 执行顺序: 从右到左（从下到上）
        c. 
      */
      {
        // 每个文件只能被其中一个loader配置处理
        oneOf: [
          {
            // 官网参考: https://webpack.docschina.org/loaders/css-loader/, 另外, 官网的文档可能会有某些依赖包没按照, 根据报错调整
            test: /\.css$/, // 只检测.css文件
            use: [
              "style-loader", // 将js中css通过创建style标签添加html文件中生效
              "css-loader", // 将css资源编译成commonjs的模块到js中
            ],
          },
          {
            // 官网参考: https://webpack.docschina.org/loaders/less-loader/
            test: /\.less$/,
            use: [
              "style-loader",  // 将 JS 字符串生成为 style 节点(HTML), 最终在HTML的header中表现为多个style: <style>...</style>
              "css-loader",  // 将 CSS 转化成 CommonJS 模块
              "less-loader", // 将less编译成css文件
            ],
          },
          {
            // 官网参考: https://webpack.docschina.org/loaders/sass-loader/
            test: /\.s[ac]ss$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader", // 将sass编译成css文件
            ],
          },
          {
            // 功能: 图片资源
            // 官网参考: https://webpack.docschina.org/loaders/stylus-loader/
            test: /\.styl$/,
            use: [
              "style-loader",
              "css-loader",
              "stylus-loader", // 将stylus编译成css文件
            ],
          },
          {
            // 官网参考: https://webpack.docschina.org/guides/asset-modules/
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求数量  缺点：体积会更大
                maxSize: 10 * 1024, // 10kb
              },
            },
            // 官网参考: https://webpack.docschina.org/guides/asset-modules/#custom-output-filename
            // 通过generator将不同类型的文件输出到不同的目录中.
            generator: {
              // 输出图片名称, [hash:10] hash值取前10位
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          {
            // 功能: 字体图片/其他资源, 注意, 这里的asset/resource类型相当于以前的file-loader, 其会原封不动的输出文件
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",
            generator: {
              // 输出名称
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            // 功能: babel配置, 将一些ES6语法转为ES5, 例如..arg, 箭头函数等, 具体option见babel.config.js
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules下的文件，其他文件都处理
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  // 4 插件
  plugins: [
    // plugin的配置
    new ESLintPlugin({
      // 官网参考: https://webpack.docschina.org/plugins/eslint-webpack-plugin/
      // 检测哪些文件
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      /*
        官网参考: https://webpack.docschina.org/plugins/html-webpack-plugin/
        模板：以public/index.html文件为基础模板创建新的html文件, 新的html文件特点：
           1. 结构和原来一致
           2. 自动在index.html中引入打包输出的资源
      */
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // 6 开发服务器: 不会输出资源，在内存中编译打包的
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  // 5 模式
  mode: "development",
  devtool: "cheap-module-source-map",
}
