module.exports = function (content, map, meta) {
  // console.log("-------------------")
  // console.log(map)
  // console.log(meta)
  // console.log("-------------------")
  // 清除文件内容中console.log(xxx)
  return content.replace(/console\.log\(.*\);?/g, "")
}
