<template>
  <div>
    <div class="path">
      <p class="path-text" :title="importFileName">
        {{ importFileName }}
      </p>
      <span style="line-height:40px;float:right;margin-right:30px">{{
        importStatus
      }}</span>
      <!-- <mapgis-ui-button type="link" style="line-height:40px;float:right;" @click="handleImportUrlModal">
        更改位置
      </mapgis-ui-button> -->
    </div>
    <!-- <mapgis-ui-progress
      class="upload-progress"
      type="circle"
      :percent="importProgress"
      :status="progressStatus"
    /> -->
    <mapgis-ui-row>
      <mapgis-ui-col :span="12">
        <mapgis-ui-progress class="upload-progress" type="circle" :percent="importProgress" :status="progressStatus" />
      </mapgis-ui-col>
      <mapgis-ui-col :span="12">
        <mapgis-ui-timeline class="upload-info">
          <mapgis-ui-timeline-item v-for="(item, index) in uploadInfos" :key="index" :color="item.state < 1 ? 'red' : 'green'">
            {{item.info}}
          </mapgis-ui-timeline-item>
        </mapgis-ui-timeline>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <span style="color:#999999;">{{ tipText }}</span>
  </div>
</template>

<script>
import UploadMixin from "../../../../mixin/UploaderMixin";

export default {
  name: "importProgress",
  mixins: [UploadMixin],
  props: {
  },
  data() {
    return {
      importStatus: "导入中...",
      importComplete: false,
      tipText: "后台导入中，当前窗口可关闭",
      progressState: true,
      importProgress: 0,
      importFileName: "上传文件名",
      uploadInfos: []
    };
  },
  created () {
    this.uploadInfos = []
  },
  watch: {
    WebsocketContent: {
      handler: function() {
        let vm = this
        if (this.WebsocketMessageId === this.webSocketTaskId && this.WebsocketAction === 'refresh') { // 比较msgid与本次导入的taskid是否一致，若不一致则不需要进行任何操作
          let msgResponse = this.WebsocketContent[0]
          let { errorCode, msg, subjectType } = msgResponse
          if (subjectType === 'geotools:import') {
            if (errorCode < 0) {
              this.importStatus = '导入失败'
              this.tipText = msg
              this.progressState = false // 进度条样式改为叉号
              this.$emit('handleUploadComplete', true) // 放开“继续上传”按钮
            } else {
              this.importStatus = '导入成功'
              this.importComplete = true
              this.tipText = '导入完成'
              this.$emit('handleUploadComplete', true) // 放开“继续上传”按钮
              // this.$emit('closeImport') // 关闭导入文件对话框
            }
          }
        } else if (this.WebsocketMessageId === this.webSocketTaskId && this.WebsocketAction === 'info') {
          let msgResponse = this.WebsocketContent[0]
          let { errorCode, msg, subject, subjectType } = msgResponse
          if (subjectType === 'geotools:import') {
            let uploadInfo = {
              info: subject,
              state: errorCode
            }
            vm.uploadInfos.push(uploadInfo)
          }
        }
      },
      deep: true
    },
    progress(next) {
      if (this.importComplete) {
        this.importProgress = 100;
      } else {
        let uploadProgress = next * 90;
        uploadProgress = parseInt(uploadProgress);
        this.importProgress = uploadProgress;
      }
    },
    importComplete (next) {
      if (next === true) {
        this.importProgress = 100;
      }
    },
    fileName(next) {
      this.importFileName = next;
    }
  },
  computed: {
    
    // handleWsRefresh() {
    //   return this.$store.state.websocket.msgid;
    // },
    progressStatus() {
      if (this.uploadError === true) {
        this.importStatus = "导入失败";
        this.tipText = this.uploadErrorMsg;
        this.$emit("handleUploadComplete", true);
        return "exception";
      } else if (this.progressState === false) {
        this.progressState = true // 进度条样式改为叉号
        return 'exception'
      } else {
        return null;
      }
    }
  },
  methods: {},
  destroyed() {}
};
</script>

<style scoped>
.path {
  width: 100%;
  height: 40px;
  /* background: #f2f5fa; */
  margin: 0 auto;
  border: 1px solid #dcdfe6b8;
}
.path-text {
  display: inline-block;
  max-width: calc(100% - 150px);
  line-height: 40px;
  margin-left: 10px;
  /* color: #3d4757; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.upload-progress {
  margin: 40px 0 66px 0;
}
.upload-info {
  margin: 30px 30px 50px 0;
  height: 166px;
  overflow: auto;
}
</style>
