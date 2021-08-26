<template>
  <div id="global-uploader" ref="uploadDiv">
    <span class="unvisible-uploader">{{ params }}</span>
    <!-- 上传 -->
    <uploader
      v-if="initGloablUpload"
      ref="uploader"
      :change="tokenChange"
      :options="options"
      :autoStart="false"
      @file-added="onFileAdded"
      @files-added="onFilesAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn
        id="global-uploader-btn"
        :attrs="attrs1"
        ref="uploadBtn"
        :single="false"
        >选择文件</uploader-btn
      >
      <uploader-btn
        id="global-uploader-btn-tiff"
        :attrs="attrs2"
        ref="uploadBtn"
        :single="false"
        >选择文件</uploader-btn
      >
      <uploader-btn
        id="global-uploader-btn-shp"
        :attrs="attrs3"
        ref="uploadBtn"
        :single="true"
        >选择文件</uploader-btn
      >
      <uploader-btn
        id="global-uploader-btn-json"
        :attrs="attrs4"
        ref="uploadBtn"
        :single="true"
        >选择文件</uploader-btn
      >
      <uploader-btn
        id="global-uploader-btn-csv"
        :attrs="attrs5"
        ref="uploadBtn"
        :single="true"
        >选择文件</uploader-btn
      >
      <uploader-btn
        id="global-uploader-btn-folder"
        ref="uploadBtnFolder"
        :directory="true"
        :single="false"
        >选择文件夹</uploader-btn
      >

      <uploader-list v-show="visible">
        <div class="file-panel" slot-scope="props" id="global-uploader-list">
          <div class="file-title">
            <span>上传总进度</span>
            <mapgis-ui-progress
              class="file-process"
              :percent="percent"
              :stroke-width="13"
            ></mapgis-ui-progress>
            <div class="operate">
              <mapgis-ui-button-group>
                <mapgis-ui-button
                  @click="handleAllStart"
                  type="default"
                  title="全部开始"
                  size="small"
                  icon="md-play"
                ></mapgis-ui-button>
                <mapgis-ui-button
                  @click="handleAllPause"
                  type="default"
                  title="全部暂停"
                  size="small"
                  icon="md-pause"
                ></mapgis-ui-button>
                <mapgis-ui-button
                  @click="handleAllCancel"
                  type="default"
                  title="全部取消"
                  size="small"
                  icon="md-power"
                ></mapgis-ui-button>
              </mapgis-ui-button-group>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file
                :class="'file_' + file.id"
                ref="files"
                :file="file"
                :list="true"
              ></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
    <mapgis-ui-spin v-if="showSpin" fix
      >大文件 {{ showSpinName }}上传计算MD5中，请耐心等待...</mapgis-ui-spin
    >
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数`
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */
import { ACCEPT_CONFIG } from "./globalConfig";
import {
  getMapGISUploadUrl,
  getMapgisToken,
  getWebSocketUrl
} from "../../config/mapgis";
import SparkMD5 from "spark-md5";
import {
  mergeSimpleUpload,
  dirnavigation,
  importVector
} from "../../axios/files";
// import { refresh } from "../../view/expolrer/js/reload";

import Uploader from "./components/uploader.vue";
import UploaderBtn from "./components/btn.vue";
import UploaderDrop from "./components/drop.vue";
import UploaderUnsupport from "./components/unsupport.vue";
import UploaderList from "./components/list.vue";
import UploaderFiles from "./components/files.vue";
import UploaderFile from "./components/file.vue";

import {
  addUploaderCount,
  subUploaderCount,
  clearUploaderCount,
  deleteCurrentFile,
  changeCurrentFilename,
  changeUiState,
  changeUploadProgress,
  changeUploadError,
  changeUploadErrorMsg,
  addCompleteUploaderCount,
  addCompleteUploaderResult,
  addGisCurrent,
  changeWebsocketAction,
  changeWebSocketContent,
  changeWebSocketContentType,
  changeWebSocketMsgid,
  changeCsvUploadComplete
} from "../../../../util/emit/upload";

import UploadMixin from "../../../../mixin/UploaderMixin";

let globalCurrentFiles = [];
let self;

export default {
  name: "mapgis-ui-global-uploader",
  mixins: [UploadMixin],
  components: {
    Uploader,
    UploaderBtn,
    UploaderDrop,
    UploaderUnsupport,
    UploaderList,
    UploaderFiles,
    UploaderFile
  },
  props: {
    action: String,
    clouddiskParam: {
      type: Object,
      default: () => {
        return {}
      }
    },
    clearParam: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      initGloablUpload: false,
      percent: 0,
      showSpin: false,
      showSpinName: "",
      options: {
        target: getMapGISUploadUrl(),
        chunkSize: 12 * 1024 * 1024,
        fileParameterName: "file",
        simultaneousUploads: 1,
        maxChunkRetries: 1,
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let data = JSON.parse(message);
          let { errorCode, status } = data;
          if (errorCode > 0 && status === 1) {
            // 文件存在于数据库中但当前文件夹中不存在--秒传--不会掉分块上传的接口
            // Notice.success({
            //   title: '当前文件目录中不存在该文件秒传',
            //   desc: '文件上传成功'
            // })
            self.updatePrecess();
            return true;
          } else if (errorCode > 0 && status === -1) {
            // 全新的文件-数据库中也不存在该文件需要分块上传-调用分块上传的接口
            /* Notice.success({
              title: '文件不存在',
              desc: '请上传'
            }) */
            return false;
          } else if (errorCode <= 0) {
            // 在当前文件夹传已经存在于当前文件夹的文件，会返回errorCode<0,不需要上传--不调接口
            Notice.error({
              title: errorCode,
              desc: data.msg
            });
            self.updatePrecess();
            return false;
          }
        },
        headers: {
          Authorization: getMapgisToken()
        },
        query() {}
      },
      attrs1: {
        /*  accept: ACCEPT_CONFIG.getAll() */
        // accept: this.$store.state.upload.param.type === 'tiff' ? 'image/tiff' : undefined
      },
      attrs2: {
        accept: "image/tiff"
      },
      attrs3: {
        accept: ACCEPT_CONFIG.shp
      },
      attrs4: {
        accept: ACCEPT_CONFIG.geojson
      },
      attrs5: {
        accept: ACCEPT_CONFIG.csv
      },
      panelShow: false, // 选择文件后，展示上传panel
      timeId: -1,
      BacgroundWebsocketInstance: undefined
    };
  },
  created() {
    self = this;
    let loopToken = window.setInterval(() => {
      let token = window.localStorage.getItem("mapgis_clouddisk_token");
      if (token !== null) {
        this.initGloablUpload = true;
        let target = getMapGISUploadUrl();
        this.options.target = target;
        this.options.headers.Authorization = token;
        this.initWebsocket();
        window.clearInterval(loopToken);
      };
    }, 200);
  },
  mounted() {},
  watch: {
    clickFlag: function(next) {
      let target = getMapGISUploadUrl();
      this.options.target = target;
    },
    options: function() {
      let target = this.getSetting();
      this.options.target = target;
    },
    clearParam: {
      immediate: true,
      handler(next) {
        if (next === true) {
          localStorage.removeItem('mapgis_clouddisk_http')
          localStorage.removeItem('mapgis_clouddisk_ip')
          localStorage.removeItem('mapgis_clouddisk_socket')
          localStorage.removeItem('mapgis_clouddisk_token')
          localStorage.removeItem('mapgis_clouddisk_group_path')
          localStorage.removeItem('mapgis_clouddisk_id')
        }
      }
    },
    clouddiskParam: {
      immediate: true,
      handler(next) {
        if (next.mapgis_clouddisk_token && next.mapgis_clouddisk_token !== '') {
          localStorage.setItem('mapgis_clouddisk_http', next.mapgis_clouddisk_http)
          localStorage.setItem('mapgis_clouddisk_ip', next.mapgis_clouddisk_ip)
          localStorage.setItem('mapgis_clouddisk_socket', next.mapgis_clouddisk_socket)
          localStorage.setItem('mapgis_clouddisk_token', next.mapgis_clouddisk_token)
          localStorage.setItem('mapgis_clouddisk_group_path', next.mapgis_clouddisk_group_path)
          localStorage.setItem('mapgis_clouddisk_id', next.mapgis_clouddisk_id)
        }
      }
    },
  },
  computed: {
    tokenChange() {
      // let token = this.$store.state.user.token
      let token = window.localStorage.getItem("mapgis_clouddisk_token");
      this.options.headers.Authorization = token;
      return token;
    },
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
    params() {
      if (
        this.$refs.uploadBtn &&
        this.$refs.uploadBtnFolder
        // && this.$store.state.upload.clickFlag > this.clickFlag
      ) {
        // this.clickFlag = this.$store.state.upload.clickFlag;
        let { isFolder, param } = this;
        let type = param.type;
        if (isFolder) {
          document.getElementById("global-uploader-btn-folder").click();
        } else {
          switch (type) {
            case "tiff":
              document.getElementById("global-uploader-btn-tiff").click();
              break;
            case "shp":
              document.getElementById("global-uploader-btn-shp").click();
              break;
            case "json":
              document.getElementById("global-uploader-btn-json").click();
              break;
            case "csv":
              document.getElementById("global-uploader-btn-csv").click();
              break;
            default:
              document.getElementById("global-uploader-btn").click();
          }
        }
      }

      return this.param;
    }
    // visible() {
    //   if (this.$refs.uploadDiv) {
    //     if (this.visible) {
    //       document.getElementById("global-uploader").style.zIndex = 100;
    //     } else {
    //       document.getElementById("global-uploader").style.zIndex = -100;
    //     }
    //   }
    //   return this.visible;
    // }
  },
  methods: {
    updatePrecess() {
      let uploadingCount = this.count;
      let uploadedCount = this.uploadCount;
      let percent = (uploadedCount / (uploadedCount + uploadingCount)) * 100;
      this.percent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
    },
    getSetting() {
      let baseUrl = "http://192.168.199.53:9011";
      let uploadUrl = "/clouddisk/rest/file/uploader/chunk";
      let target = baseUrl + uploadUrl;
      return target;
    },
    onFileAdded(file) {
      let fileType = this.param.type;
      if (fileType === 'csv') {
        changeUiState({ state: "check" });
      } else {
        changeUiState({ state: "upload" });
      }
      changeUploadError({ uploadError: false });
      changeUploadProgress({ progress: 0 });
      changeCurrentFilename({ filename: file.name });

      globalCurrentFiles.push(file);
      this.showSpin = true;
      this.showSpinName = file.name;
      this.computeMD5(file);
    },
    onFilesAdded(files, fileList) {
      // console.log("files add", files, fileList);
    },
    onFileProgress(rootFile, file, chunk) {
      changeUploadProgress({ progress: file.progress() });
      let uploadingCount = self.count;
      let uploadedCount = self.uploadCount;
      self.percent = (uploadedCount / (uploadedCount + uploadingCount)) * 100;
      console.log(
        "上传中" +
          file.name +
          chunk.startByte / 1024 / 1024 +
          "~" +
          chunk.endByte / 1024 / 1024
      );
    },
    onFileSuccess(rootFile, file, response, chunk) {
      subUploaderCount();
      deleteCurrentFile({ file: file });
      addCompleteUploaderCount();
      addCompleteUploaderResult({ file: file });

      self.updatePrecess();
      let res = JSON.parse(response);
      // 服务器自定义的错误，这种错误是Uploader无法拦截的
      /*       if (!res.result) {
        this.$message({ message: res.message, type: "error" });
        return;
      } */
      // 如果服务端返回需要合并
      if (res.data.needMerge) {
        let type = self.param.type;
        let isCache = self.param.isCache;
        let isGisImport = self.param.isGisImport
        let taskid = self.param.taskid
        // console.warn('本次上传对应taskid:', taskid)
        let gisFormat = type === "tiff" ? "raster" : "vector";
        let formdata = {
          // @date 2021/07/16
          folderDir: self.uploaduri,
          totalSize: file.size,
          type: file.fileType,
          identifier: file.uniqueIdentifier,
          filename: file.name,
          prelocation: file.relativePath,
          gisFormat: gisFormat,
          isCache: isCache,
          isGisImport: isGisImport || false,
          taskid: taskid || ''
        };
        console.log("mergeSimpleUpload 尝试发送", formdata);
        mergeSimpleUpload(formdata)
          .then(res => {
            console.log("mergeSimpleUpload 成功发送", res);
            changeCsvUploadComplete({ csvUploadComplete: true });
            // 文件合并成功
            // let data = res.data
            // Notice.success({
            //   title: data.msg,
            //   desc: JSON.stringify(data)
            // })
            // refresh();
            // 入库 // 这里服务端自动做导入
            // if (this.$store.state.upload.param.isImport && this.$store.state.upload.param.type !== 'tiff') {
            //   this.importFile(this.$store.state.upload.param.folderDir, file.name)
            // }
          })
          .catch(e => { 
            console.log("mergeSimpleUpload 失败发送", e);
          });

        // 不需要合并 */
      } else {
        console.log("上传成功");
        changeUploadProgress({ progress: 1 });
        changeCsvUploadComplete({ csvUploadComplete: true });
      }
    },
    onFileError(rootFile, file, response, chunk) {
      let res;
      if (response === "") {
        res = {
          errorCode: "500",
          msg: "服务器返回参数为空，请联系服务器管理员或者检查网络链接"
        };
      } else {
        res = JSON.parse(response);
      }
      this.$message.error({
        content: "文件:" + rootFile.name + "上传失败！"
      });
      this.$message.error({
        content: "错误码:" + res.errorCode + "   失败原因： " + res.msg
      });
      changeUploadError({ uploadError: true });
      changeUploadErrorMsg({ uploadErrorMsg: res.msg });
    },
    importFile(uri, name) {
      let self = this;
      let isCache = this.param.isCache;
      dirnavigation(encodeURI(uri))
        .then(res => {
          if (res.status === 200) {
            let dirResult = res.data.data;
            dirResult = dirResult.filter(item => item.title === name);
            let importParams = {
              srcUrl: dirResult[0].url,
              destPath: uri,
              force: true,
              isCache: isCache
            };
            importVector(importParams)
              .then(res => {
                if (res.status === 200) {
                  let result = res.data;
                  let { errorCode, msg } = result;
                  if (errorCode < 0) {
                    self.$Notice.error({ title: errorCode, desc: msg });
                  } else {
                    self.$Notice.success({
                      title: "已添加导入任务",
                      desc: "稍后可到任务日志中查看导入进程"
                    });
                    addGisCurrent(dirResult[0].url);
                  }
                }
              })
              .catch(error => {
                self.$Notice.error({
                  title: "网络异常,请检查链接",
                  desc: error
                });
              });
          }
        })
        .catch(error => {
          Notice.error({ title: "网络异常,请检查链接", desc: error });
        });
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileRaw = file.file;
      let time = new Date().getTime();
      let md5 = "";
      let chunkSize = 536870912; // 每次读取文件的大小
      let currentChunk = 0; // 当前读取文件块
      let chunks = Math.ceil(file.size / chunkSize);
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let fileReader = new FileReader();
      let spark = new SparkMD5.ArrayBuffer();
      let self = this;

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        // 注意这里的 fileRaw
        fileReader.readAsArrayBuffer(blobSlice.call(fileRaw, start, end));
      }

      file.pause();

      fileReader.onload = function(e) {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          addUploaderCount();
          // @date 2021/07/16 - 潘卓然
          // 这个地方记得后面跟一下，原始的store里面的这个行为是被屏蔽的，记得后期检查一下
          // self.$store.commit("addCurrentFile", { file: file });
          md5 = spark.end();
          // 添加额外的参数
          self.uploader.opts.query = {
            ...self.params
          };

          console.log(
            `MD5计算完毕：${file.id} ${
              file.name
            } MD5：${md5} 用时：${new Date().getTime() - time} ms`
          );

          self.showSpin = false;
          file.uniqueIdentifier = md5;
          file.resume(); // 浏览器端必须是 pause 客户端可以是 resume
        }
      };

      fileReader.onerror = function(e) {
        console.error("fileReader Error", e);
        self.showSpin = false;
        /* this.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        ); */
      };

      loadNext();
    },

    handleAllStart() {
      globalCurrentFiles.forEach(file => {
        file.resume();
      });
    },

    handleAllPause() {
      globalCurrentFiles.forEach(file => {
        file.pause();
      });
    },

    handleAllCancel() {
      globalCurrentFiles.forEach(file => {
        file.cancel();
      });
      clearUploaderCount();
      this.percent = 0;
      globalCurrentFiles = [];
      this.uploader.cancel();
    },

    error(msg) {
      /* this.$notify({
        title: this.$t("c.false"),
        message: msg,
        type: "error",
        duration: 2000
      }); */
    },

    initWebsocket() {
      let vm = this
      const wsUrl = getWebSocketUrl();
      this.BacgroundWebsocketInstance = new WebSocket(wsUrl);
      this.updateWebsocket();
      this.BacgroundWebsocketInstance.onopen = function () {
        console.log(`【WebSocket连接成功】【${new Date().toLocaleString()}】`, wsUrl);
      };
      this.BacgroundWebsocketInstance.onerror = function (event) {
        console.log(`【WebSocket连接错误】【${new Date().toLocaleString()}】`, event);
      };
      this.BacgroundWebsocketInstance.onclose = function (event) {
        console.log(`【WebSocket已关闭连接】【${new Date().toLocaleString()}】`, event);
      };
    },
    updateWebsocket() {
      const vm = this;
      this.BacgroundWebsocketInstance.onmessage = function(event) {
        console.log(`【WebSocket接收消息中】【${new Date().toLocaleString()}】`, event)
        let flag = vm.isJSON(event.data);
        if (flag) {
          // console.log('websocket', event);
          let data = JSON.parse(event.data);
          let action = data.action;
          let msgid = data.msgid;
          let contentStr = data.content;
          let contentJson = JSON.parse(contentStr);
          if (contentJson !== {}) {
            changeWebsocketAction({ action: action });
            changeWebSocketContent({ content: contentJson });
            changeWebSocketMsgid({ msgid: msgid });
          }
        } else {
          // console.log("发送成功！", event.data);
        }
      };
    },
    removeWebsocket() {},
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          let obj = JSON.parse(str)
          if (typeof obj === 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
      return false
    }
  },
  destroyed() {
    // Bus.$off("openUploader");
  }
};
</script>

<style scoped lang="less">
#global-uploader {
  position: fixed;
  width: calc(100vw - 165px);
  height: calc(100vh - 70px);
  z-index: -100;
  right: 0px;
  top: 70px;

  .uploader-app {
    width: 100%;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    /* border-radius: 7px 7px 0 0; */
    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); */
    z-index: 100;

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      & > span {
        font-family: "微软雅黑";
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #3a85c6;
      }

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-process {
      width: calc(100vw - 400px);
      margin-left: 20px;
    }

    .file-list {
      position: relative;
      height: calc(100vh - 114px);
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;

      > li {
        height: 49px;
        background-color: #fff;
      }
    }
  }

  .visible {
    z-index: 100;
    right: 15px;
    top: 90px;
    .file-title {
      background-color: #e7ecf2;
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  .uploader-file-icon {
    &:before {
      content: "" !important;
    }

    &[icon="image"] {
      background: url(./images/image-icon.png);
    }
    &[icon="video"] {
      background: url(./images/video-icon.png);
    }
    &[icon="document"] {
      background: url(./images/text-icon.png);
    }
  }

  .uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
#global-uploader-btn-tiff {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
#global-uploader-btn-shp {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
#global-uploader-btn-json {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
#global-uploader-btn-csv {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

#global-uploader-btn-folder {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}

.unvisible-uploader {
  display: none;
}

.file-process > .ivu-progress-bg {
  background-color: #2d8cf0;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  position: relative;
}
</style>
