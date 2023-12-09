const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")  // 提取css
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")  // css压缩
const TerserWebpackPlugin = require("terser-webpack-plugin")  // js压缩
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")  // 图片压缩
const CopyPlugin = require("copy-webpack-plugin") // 将一些资源直接复制到打包目录, ico文件
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

// 获取cross-env定义的环境变量
const isProduction = process.env.NODE_ENV === "production"

// 返回处理样式loader函数
const getStyleLoaders = (pre) => {
  return [
    // style-loader, css-loader
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
    "css-loader",
    // postcss-loader
    {
      // 处理css兼容性问题, 配合package.json中browserslist来指定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    // 参数loader: less-loader, sass-loader, stylus-loader, 若不传pre则为undefined, 在外层被filter(boolean)过滤
    pre && {
      loader: pre,
      options:
        pre === "less-loader"
          ? {
            // antd自定义主题配置
            // 主题色文档：https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
            lessOptions: {
              modifyVars: { "@primary-color": "#1DA57A" },
              javascriptEnabled: true,
            },
          }
          : {},
    },
  ].filter(Boolean)
}

module.exports = {
  // 1. 五大模块: 入口
  entry: "./src/main.js",
  // 2. 五大模块: 输出
  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,  // 输出目录
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js",  // 入口文件在dist中的输出文件
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js",  // 动态导入等
    assetModuleFilename: "static/media/[hash:10][ext][query]",  // 图片资源
    clean: true, // 清理老的打包目录
  },
  // 3. 五大模块: 模块
  module: {
    rules: [
      // a. 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      // b. 处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        type: "asset",
        parser: {
          // 将小于10K的图片变为base64编码, 注意asset和asset/resource的异同点
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      // c. 处理其他资源, 比如mp3, mp4, ttf等
      {
        test: /\.(woff2?|ttf)$/,
        type: "asset/resource",
      },
      // d. 处理js
      {
        test: /\.jsx?$/,  // js和jsx
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",  // 配合babel.config.js文件
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          // 解决: jsx/js改动导致的整个页面刷新, 这里使用react官网提供的HMR插件
          plugins: [
            !isProduction && "react-refresh/babel", // 激活js的HMR
          ].filter(Boolean),
        },
      },
    ],
  },
  // 4. 五大模块: 插件
  plugins: [
    // 功能: eslint代码检查, 需要配置.eslintrc.js文件
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    // 功能: 处理html, 以现有的html文件为模板创建新的html文件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),

    isProduction &&
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    isProduction &&
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          globOptions: {
            // 忽略index.html文件
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
    // 功能: 解决js/jsx代码的HMR, 上面的Loader也有配置
    !isProduction && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),

  // 5. 五大模块: 模式
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",

  optimization: {
    // 功能: 代码分割
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        // react react-dom react-router-dom 一起打包成一个js文件
        react: {
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          name: "chunk-react",
          priority: 40,
        },
        // antd 单独打包
        antd: {
          test: /[\\/]node_modules[\\/]antd[\\/]/,
          name: "chunk-antd",
          priority: 30,
        },
        // 剩下node_modules单独打包
        libs: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-libs",
          priority: 20,
        },
      },
    },
    // 功能: 解决代码分割导致的缓存失效, 每次都生成新的文件名就会无法命中缓存
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    // 是否需要进行压缩
    minimize: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  // 功能: webpack解析模块加载选项, 在引入模块的时候会解析, 这里主要是为了解决import jsx文件的时候自动补全扩展名
  resolve: {
    // 自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true, // 开启HMR
    historyApiFallback: true, // 解决前端刷新页面, 此时路由刷新但是报错404问题, 通过重定向到index页面来解决
  },
  performance: false, // 关闭性能分析，提升打包速度
}
