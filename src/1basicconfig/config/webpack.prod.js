const path = require("path") // nodejs核心模块，专门用来处理路径问题
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

// 用来获取处理样式的loader
function getStyleLoader (pre) {
  return [
    MiniCssExtractPlugin.loader, // 提取css成单独文件
    "css-loader", // 将css资源编译成commonjs的模块到js中
    /*
      postcss工作方式类似于JavaScript的Babel，可以被认为是CSS的编译器或转换器, 例如flex
      配置: 在package.json中配置browserslist给与webpack一个需要转换的标准
    */
    {
      loader: "postcss-loader", 
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre,  // 参数
  ].filter(Boolean)
}

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  // 输出
  output: {
    // 所有文件的输出路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录
    path: path.resolve(__dirname, "../dist"), // 绝对路径
    // 入口文件打包输出文件名
    filename: "static/js/main.js",
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        // oneOf: 这个功能和react的路由的switch是同样的原理，即匹配成功一个就不再遍历后面的配置了
        oneOf: [
          {
            test: /\.css$/, // 只检测.css文件
            use: getStyleLoader(), // 执行顺序：从右到左（从下到上）
          },
          {
            test: /\.less$/,
            // loader: 'xxx', // 只能使用1个loader
            use: getStyleLoader("less-loader"),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求数量  缺点：体积会更大
                maxSize: 10 * 1024, // 10kb
              },
            },
            generator: {
              // 输出图片名称
              // [hash:10] hash值取前10位
              filename: "static/images/[hash:10][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?|map3|map4|avi)$/,
            type: "asset/resource",
            generator: {
              // 输出名称
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            test: /\.js$/,
            // 排除node_modules下的文件，其他文件都处理, 加快编译速度, 另外还有include, 一般仅仅适用于js
            // css和其他资源一般需要打包在一起, 所以他们不需要用include/exclude.
            exclude: /node_modules/,
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // plugin的配置
    new ESLintPlugin({
      // 检测哪些文件
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
    }),
    new HtmlWebpackPlugin({
      // 模板：以public/index.html文件创建新的html文件
      // 新的html文件特点：1. 结构和原来一致 2. 自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 官网参考: https://webpack.docschina.org/plugins/mini-css-extract-plugin/
    // 功能: 解决之前将css打包到js中, 通过<style></style>来导入css, 进而导致闪屏问题. (调低网速就可以看到)
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // 官网参考: https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/
    // 功能: CSS压缩
    new CssMinimizerPlugin(),
  ],
  // 模式
  mode: "production",
  // 官网参考: https://webpack.docschina.org/configuration/devtool/
  devtool: "source-map",
}
