// 注意点: 想要webpack打包资源，必须引入该资源, 在引入js时不需要文件扩展名, 在引起其他文件的时候则需要
import count from "./js/count"
import sum from "./js/sum"

// 功能点: 处理样式资源: css, less, sass, scss, styl
// a. css文件: 使用css-loader
import "./css/iconfont.css"
import "./css/index.css"
// b. less: 使用less-loader
import "./less/index.less"
// c. sass/scss: 使用sass-loader
import "./sass/index.sass"
import "./sass/index.scss"
// d. styl: 使用stylus-loader
import "./stylus/index.styl"

// 功能点: 图片资源, 在webpack5中不再使用file-loader, url-loader来处理图片, 而是将这两个Loader内置
// 使用: 直接使用asset即可完成图片的加载

const result = count(2, 2)
console.log(result)
console.log(sum(1, 2, 3, 4))
