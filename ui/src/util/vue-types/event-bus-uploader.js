import Vue from "vue";

export let defaultUpload = {
  count: 0,
  visible: false,
  current: [],
  param: {},
  isFolder: false,
  clickFlag: 0,
  fileName: "",
  status: "init", // 暂定为init(选择文件前)、check(csv预览)、upload(上传过程)
  progress: 0,
  uploadError: false,
  uploadCount: 0, // 原始云盘的complete模块
  uploads: [], // 原始云盘的complete模块
  giscurrents: [], // 原始云盘的gis模块
  giscount: [] // 原始云盘的gis模块
};

export default new Vue({
  upload: {
    count: 0,
    visible: false,
    current: [],
    param: {},
    isFolder: false,
    clickFlag: 0,
    fileName: "",
    status: "init", // 暂定为init(选择文件前)、check(csv预览)、upload(上传过程)
    progress: 0,
    uploadError: false,
    uploadCount: 0, // 原始云盘的complete模块
    uploads: [], // 原始云盘的complete模块
    giscurrents: [], // 原始云盘的gis模块
    giscount: [] // 原始云盘的gis模块
  }
});
