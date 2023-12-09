# 处理图片资源

过去在 Webpack4 时，我们处理图片资源通过 `file-loader` 和 `url-loader` 进行处理. 现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了，我们只需要简单配置即可处理图片资源

## 1. 配置

```js
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

## 2. 添加图片资源

- src/images/1.jpeg
- src/images/2.png
- src/images/3.gif

## 3. 使用图片资源

- src/less/index.less

```css
.box2 {
  width: 100px;
  height: 100px;
  background-image: url("../images/1.jpeg");
  background-size: cover;
}
```

- src/sass/index.sass

```css
.box3
  width: 100px
  height: 100px
  background-image: url("../images/2.png")
  background-size: cover
```

- src/styl/index.styl

```css
.box5
  width 100px
  height 100px
  background-image url("../images/3.gif")
  background-size cover
```

## 4. 运行指令

```:no-line-numbers
npx webpack
```

打开 index.html 页面查看效果

## 5. 输出资源情况

此时如果查看 dist 目录的话，会发现多了三张图片资源，因为 Webpack 会将所有打包好的资源输出到 dist 目录下

- 为什么样式资源没有呢？

因为经过 `style-loader` 的处理，样式资源打包到 main.js 里面去了，所以没有额外输出出来

## 6. 对图片资源进行优化

将小于某个大小的图片转化成 data URI 形式（Base64 格式）

```js
const path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        // 小于10kb的图片会被base64处理, 从而减少请求数量， 这个配置并非必须得。
        // a. 不设置的时候： 如果引入三张图片，则打包后再dist中会有三张图片
        // b. 设置之后，如果引入的三张图片中有一个小图片， 则最终dist中只有两张图片了， 另外一种图片被转为base64了
        // 为何不把所有的图片都转为base64? 因为图片转为base64会增加1/3的体积，如果是大图片再进行base64就有点费性能
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 
          }
        }
      },
    ],
  },
  plugins: [],
  mode: "development",
};
```

- 优点：减少请求数量
- 缺点：体积变得更大

此时输出的图片文件就只有两张，有一张图片以 data URI 形式内置到 js 中了（注意：需要将上次打包生成的文件清空，再重新打包才有效果）