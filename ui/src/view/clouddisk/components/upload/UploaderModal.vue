<template>
  <mapgis-ui-modal
    :visible="show"
    :maskClosable="true"
    title="导入文件"
    :width="width"
    :dialog-style="{ top: '100px' }"
    @cancel="handleCloseImport"
    :footer="null"
  >
    <template slot="footer">
      <mapgis-ui-button
        key="back"
        :disabled="!continueUpload"
        @click="handleBack"
      >
        继续上传
      </mapgis-ui-button>
      <mapgis-ui-button key="close" type="primary" @click="handleCloseImport">
        关闭
      </mapgis-ui-button>
    </template>
    <mapgis-ui-uploader-data
      v-if="uistatus === 'init' && show"
      :curImportUrl="curImportUrl"
      :importDestUrl="importDestUrl"
      @changePathText="changePathText"
    />
    <mapgis-ui-uploader-progress
      v-if="uistatus === 'upload' && show"
      @handleUploadComplete="handleUploadComplete"
    />
  </mapgis-ui-modal>
</template>

<script>
import MapgisUiUploaderData from "./UploaderData.vue";
import MapgisUiUploaderProgress from "./UploaderProgress.vue";
import UploadMixin from "../../../../mixin/UploaderMixin";
import { changeUiState } from "../../../../util/emit/upload";

export default {
  name: "mapgis-ui-upload-modal",
  mixins: [UploadMixin],
  components: {
    MapgisUiUploaderData,
    MapgisUiUploaderProgress
  },
  model: {
    prop: "show",
    event: "change"
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      curImportUrl: "",
      importDestUrl: "",
      continueUpload: false
    };
  },
  methods: {
    handleImport() {
      /* this.curImportUrl = this.$store.state.path.current.uri || "";
      this.importDestUrl = this.importFileInfo(this.curImportUrl);
      this.show = true; */
      this.$emit("ok", true);
    },
    handleCloseImport() {
      changeUiState({ status: "init" });
      this.$emit("cancel", false);
      this.$emit("change", false);
      this.continueUpload = false;
    },
    handleBack() {
      changeUiState({ status: "init" });
      this.continueUpload = false;
    },
    changePathText(url) {
      this.curImportUrl =
        url === "" ? this.$store.state.path.current.uri || "" : url;
      this.importDestUrl = this.importFileInfo(this.curImportUrl);
    },
    handleUploadComplete(flag) {
      this.continueUpload = flag;
    },
    importFileInfo(url) {
      let gisindex = url.indexOf("/");
      if (gisindex >= 0) {
        url = "常规文件夹" + url.slice(gisindex);
      } else {
        url = "常规文件夹";
      }
      return url;
    }
  }
};
</script>
