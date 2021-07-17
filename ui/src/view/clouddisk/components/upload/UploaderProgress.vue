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
    <mapgis-ui-progress
      class="upload-progress"
      type="circle"
      :percent="importProgress"
      :status="progressStatus"
    />
    <span style="color:#999999;">{{ tipText }}</span>
  </div>
</template>

<script>
import UploadMixin from '../../../../mixin/UploaderMixin';

export default {
  name: "importProgress",
  mixins: [UploadMixin],
  props: {},
  data() {
    return {
      importStatus: "导入中...",
      importComplete: false,
      tipText: "后台导入中，当前窗口可关闭"
    };
  },
  watch: {
    handleWsRefresh() {
      let wsAction = this.$store.state.websocket.wsAction;
      let contentType = this.$store.state.websocket.contentType;
      let wsContent = this.$store.state.websocket.wsContent;
      if (
        wsAction === "refresh" &&
        contentType === "dirNavigation" &&
        wsContent[contentType] !== ""
      ) {
        this.importStatus = "导入成功";
        this.importComplete = true;
        this.tipText = "导入完成";
        this.$emit("handleUploadComplete", true);
      }
    }
  },
  computed: {
    importFileName() {
      return this.fileName;
    },
    importProgress() {
      if (this.importComplete) {
        return 100;
      } else {
        let uploadProgress = this.progress * 90;
        uploadProgress = parseInt(uploadProgress);
        return uploadProgress;
      }
    },
    handleWsRefresh() {
      return this.$store.state.websocket.msgid;
    },
    progressStatus() {
      if (this.uploadError === true) {
        this.importStatus = "导入失败";
        this.tipText = "导入失败";
        this.$emit("handleUploadComplete", true);
        return "exception";
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
  background: #f2f5fa;
  margin: 0 auto;
}
.path-text {
  display: inline-block;
  max-width: calc(100% - 150px);
  line-height: 40px;
  margin-left: 10px;
  color: #3d4757;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.upload-progress {
  margin: 40px 0 66px 0;
}
</style>
