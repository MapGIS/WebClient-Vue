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
  uploadError: false
};

export let defaultGis = {
  giscurrents: [], // 原始云盘的gis模块
  giscount: [] // 原始云盘的gis模块
};

export let defaultComplete = {
  uploadCount: 0, // 原始云盘的complete模块
  uploads: [] // 原始云盘的complete模块
};

export let defaultWebsocket = {
  WebsocketAction: "",
  WebsocketContentType: "",
  WebsocketContent: {},
  WebsocketMessageId: "" // 区分消息
};

export let defaultPath = {
  // uri: "",
  uploaduri: ""
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
    uploadError: false
  },
  complete: {
    uploadCount: 0, // 原始云盘的complete模块
    uploads: [] // 原始云盘的complete模块
  },
  gis: {
    giscurrents: [], // 原始云盘的gis模块
    giscount: [] // 原始云盘的gis模块
  },
  websocket: {
    WebsocketAction: "",
    WebsocketContentType: "",
    WebsocketContent: {},
    WebsocketMessageId: "" // 区分消息
  },
  path: {
    // uri: "",
    uploaduri: ""
  }
});
