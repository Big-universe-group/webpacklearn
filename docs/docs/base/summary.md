### 目录

#### 基本用法

1. 基本使用

+ 基本功能介绍： 开发模式、依赖下载、webpack启动等

+ Webpack 基本配置： 五大核心概念、webpack配置文件

2. 样式资源（5页）： css, less, sass/scss, stylus
3. 处理图片资源（14页）： 使用webpack5中的asset来处理图片并增加最小图片体积来优化请求次数
4. 修改图片资源的名称和路径（18页）：使用generator来指定图片等资源的输出目录和文件名
5. 处理字体图标资源（21页）： 使用asset/resource来处理其他资源
6. 处理其他资源
7. 处理js资源（26页）

+ Eslint: 代码检查工具
+ babel：代码转换兼容工具

8. 处理HTML资源（36页）： 用以解决基于index.html进行自动的js和css导入、自动的复制到dist目录中

#### 辅助说明

1. 生产模式介绍（39页）
2. CSS处理（45页）

+ 提取css成单独文件： 通过MiniCssExtractPlugin将css提取到一个单独的文件而非<style>的方式，避免闪屏
+ css兼容处理： 通过postcss loader，用以解决大多数样式兼容问题，其中还可以使用预制插件`postcss-preset-env`
+ 在package.json中增加browserslist来配置兼容的级别

3. CSS压缩（53页）： 通过CssMinimizerPlugin来进行css文件的压缩处理

