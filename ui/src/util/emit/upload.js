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
      1 giscount: [] // 原始云盘的gis模块
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
  EventBus.$options.upload.count = EventBus.$options.upload.count + 1;
  EventBus.$emit("add-uploader-count", count);
};

export const subUploaderCount = () => {
  EventBus.$options.upload.count = EventBus.$options.upload.count - 1;
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
  EventBus.$options.upload.filename = filename;
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
export const changeUploadProcess = payload => {
  const { process = 0 } = payload;
  EventBus.$options.upload.process = process;
  EventBus.$emit("change-upload-process", process);
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

// -----------------------原始云盘 Complete 模块--------------------
export const addCompleteUploaderCount = () => {
  let count = EventBus.$options.upload.uploadCount + 1;
  EventBus.$options.upload.uploadCount = count;
  EventBus.$emit("add-complete-uploader-count", count);
};

export const addCompleteUploaderResult = payload => {
  let uploads = EventBus.$options.upload.uploads.push(payload.file);
  EventBus.$options.upload.uploads = uploads;
  EventBus.$emit("add-complete-uploader-result", uploads);
};
// -----------------------原始云盘 Complete 模块--------------------

// -------------------------原始云盘 Gis 模块-----------------------
export const addGisCurrent = payload => {
  let giscurrents = EventBus.$options.upload.giscurrents.push(payload);
  let giscount = giscurrents.length;
  EventBus.$emit("add-gis-current", giscurrents);
};
// -------------------------原始云盘 Gis 模块-----------------------
