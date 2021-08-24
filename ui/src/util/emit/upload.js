import EventBus from "../vue-types/event-bus-uploader";

/**
 * 上传EventBus的事件机制
 * @param {*} themeStyle 
 * @example  0 表示有被读取行为  1表示有被修改行为
 export default new Vue({
    0   count: 0,
    0   visible: false,
        current: [],
    0 1 param: {},
    0   isFolder: false,
    0   clickFlag: 0,
    0 1 fileName: "",
    0 1 status: "init", // 暂定为init(选择文件前)、check(csv预览)、upload(上传过程)
    0 1 progress: 0,
    0 1 uploadError: false,
      1 uploadCount: 0, // 原始云盘的complete模块
      1 uploads: [], // 原始云盘的complete模块
      1 giscurrents: [], // 原始云盘的gis模块
      1 giscount: []， // 原始云盘的gis模块
      websocket: { // 原始云盘的websocket模块
        WebsocketAction: "",
        WebsocketContentType: "",
        WebsocketContent: {},
        WebsocketMessageId: "" // 区分消息
      }
  });
 */

export const openUploader = payload => {
  EventBus.$options.upload.isFolder = false;
  EventBus.$options.upload.param = payload.param;
  let clickFlag = ++EventBus.$options.upload.clickFlag;
  EventBus.$options.upload.clickFlag = clickFlag;

  EventBus.$emit("open-uploader", {
    isFolder: false,
    clickFlag: clickFlag,
    param: payload.param
  });
};

export const addUploaderCount = () => {
  let count = ++EventBus.$options.upload.count;
  EventBus.$emit("add-uploader-count", count);
};

export const subUploaderCount = () => {
  let count = --EventBus.$options.upload.count;
  EventBus.$emit("sub-uploader-count", count);
};

export const clearUploaderCount = () => {
  EventBus.$options.upload.count = 0;
  EventBus.$emit("clear-uploader-count", 0);
};

export const deleteCurrentFile = payload => {
  const file = payload.file;
  let current = EventBus.$options.upload.current.filter(item => {
    const { uniqueIdentifier, name } = item;
    if (file.name === name && file.uniqueIdentifier === uniqueIdentifier) {
    } else {
      return item;
    }
  });
  EventBus.$options.upload.current = current;
  EventBus.$emit("delete-current-file", current);
};

/**
 * @description 记录当前上传的文件名称，web端统一使用单线程模式
 * @param {String} filename
 */
export const changeCurrentFilename = payload => {
  const { filename = "" } = payload;
  EventBus.$options.upload.fileName = filename;
  EventBus.$emit("change-current-filename", filename);
};

/**
 * @description 记录当前界面的显示状态
 * @param {String} state
 */
export const changeUiState = payload => {
  const { state = "init" } = payload;
  EventBus.$options.upload.state = state;
  EventBus.$emit("change-ui-state", state);
};

/**
 * @description 记录当前单线程文件的上传进度,此过程发生在MD5计算完成后，网络传输的进度
 * @param {Number} process [0 ~ 1]
 */
export const changeUploadProgress = payload => {
  const { progress = 0 } = payload;
  EventBus.$options.upload.progress = progress;
  EventBus.$emit("change-upload-progress", progress);
};

/**
 * @description 监控上传过程过程中的错误，一发生则置为true
 * @param {Boolean} uploadError
 */
export const changeUploadError = payload => {
  const { uploadError = false } = payload;
  EventBus.$options.upload.uploadError = uploadError;
  EventBus.$emit("change-upload-error", uploadError);
};

/**
 * @description 监控上传过程过程中的错误信息
 * @param {String} uploadErrorMsg
 */
export const changeUploadErrorMsg = payload => {
  EventBus.$options.upload.uploadErrorMsg = payload.uploadErrorMsg;
  EventBus.$emit("change-upload-error-msg", payload.uploadErrorMsg);
};

/**
 * @description 表示csv数据的首次上传是否完成
 * @param {Boolean} csvUploadComplete 
 */
export const changeCsvUploadComplete = payload => {
  EventBus.$options.upload.csvUploadComplete = payload.csvUploadComplete;
  EventBus.$emit("change-upload-csv-complete", payload.csvUploadComplete);
};

/**
 * @description 记录最新一次导入操作的taskId，此taskId与WebSocket消息的MsgId相同时，即表示该消息涉及当前最新一次导入
 * @param {String} webSocketTaskId 
 */
export const changeUploadWebsocketTaskId = payload => {
  EventBus.$options.upload.webSocketTaskId = payload.webSocketTaskId;
  EventBus.$emit("change-upload-taskid", payload.webSocketTaskId);
};
// handleWebSocketTaskId (state, payload) {
//   state.webSocketTaskId = payload.webSocketTaskId
// },

// -----------------------原始云盘 Complete 模块--------------------
export const addCompleteUploaderCount = () => {
  let count = EventBus.$options.complete.uploadCount + 1;
  EventBus.$options.upload.uploadCount = count;
  console.log("add-complete-uploader-count", EventBus.$options);
  EventBus.$emit("add-complete-uploader-count", count);
};

export const addCompleteUploaderResult = payload => {
  let uploads = EventBus.$options.complete.uploads.push(payload.file);
  EventBus.$options.uploads = uploads;
  console.log("add-complete-uploader-result", EventBus.$options);
  EventBus.$emit("add-complete-uploader-result", uploads);
};
// -----------------------原始云盘 Complete 模块--------------------

// -------------------------原始云盘sx Gis 模块-----------------------
export const addGisCurrent = payload => {
  let giscurrents = EventBus.$options.gis.giscurrents.push(payload);
  let giscount = giscurrents.length;
  EventBus.$emit("add-gis-current", giscurrents);
};
// -------------------------原始云盘 Gis 模块-----------------------

export const changeWebsocketAction = payload => {
  EventBus.$options.websocket.WebsocketAction = payload.action;
  EventBus.$emit("change-websocket-action", payload.action);
};
export const changeWebSocketContent = payload => {
  EventBus.$options.websocket.WebsocketContent = payload.content;
  EventBus.$emit("change-websocket-content", payload.content);
};
export const changeWebSocketMsgid = payload => {
  EventBus.$options.websocket.WebsocketMessageId = payload.msgid;
  EventBus.$emit("change-websocket-msgid", payload.msgid);
};

// -------------------------原始云盘 Path 模块-----------------------
export const changePathUploaduri= payload => {
  // console.warn("payload", payload);
  EventBus.$options.path.uploaduri = payload.uri;
  EventBus.$emit("change-path-uploaduri", payload.uri);
};
