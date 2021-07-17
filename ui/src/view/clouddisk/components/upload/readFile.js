import SparkMD5 from "spark-md5";

export function computedMd5(file) {
  //  默认可以上传的文件的最大容量为1Gb   =1073741824字节
  // file.size  返回文件的大小(字节数)
  // 当文件的大小超过1G时就要分块计算文件MD5值  因为一次不可以读取超过1G的内容
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  let chunkSize = 1073741824; // 每次读取文件的大小
  let currentChuck = 0; // 当前读取文件块
  let chunks = Math.ceil(file.size / chunkSize);
  let fileRender = new FileReader();
  let start, end;
  // var bigfilemd5
  fileRender.onload = function(e) {
    SparkMD5.append(e.target.result);
    // bigfilemd5 += SparkMD5(e.target.result)
    currentChuck++;
    if (currentChuck < chunks) {
      start = currentChuck * chunkSize; // 每次读取文件开始
      end = start + chunkSize >= file.size ? file.size : start + chunkSize; // 结尾
      fileRender.readAsArrayBuffer(blobSlice.call(file, start, end));
    } else {
      console.log("计算结束", SparkMD5.end());
    }
  };
}
