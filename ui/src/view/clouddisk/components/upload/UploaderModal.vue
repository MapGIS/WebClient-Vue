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
      :handleCloseUploadModal="handleCloseUploadModal"
      @handleUploadComplete="handleUploadComplete"
    />
    <mapgis-ui-clouddisk-transform ref="layerTransform" :selectLists="selectLists" :currentDocument="currentDocument" :handleNewDocument="handleNewDocument"/>
  </mapgis-ui-modal>
</template>

<script>
import MapgisUiUploaderData from "./UploaderData.vue";
import MapgisUiUploaderProgress from "./UploaderProgress.vue";
import MapgisUiClouddiskTransform from "../select/LayerTransform";
import UploadMixin from "../../../../mixin/UploaderMixin";
import { changeUiState } from "../../../../util/emit/upload";
import { getFileByWebsocketCallback } from "../../axios/files";

export default {
  name: "mapgis-ui-upload-modal",
  mixins: [UploadMixin],
  components: {
    MapgisUiUploaderData,
    MapgisUiUploaderProgress,
    MapgisUiClouddiskTransform
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
    },
    currentDocument: {
      type: Object,
      default: () => {
        return {};
      }
    },
    handleNewDocument: Function,
    handleCloseUploadModal: Function,
  },
  data() {
    return {
      curImportUrl: "",
      importDestUrl: "",
      continueUpload: false,
      selectLists: [],
    };
  },
  watch: {
    WebsocketMessageId: {
      handler(next) {
        this.handleWebsocket(next);
      },
      deep: true
    }
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
      this.curImportUrl = url === "" ? this.uploaduri || "" : url;
      // console.warn("this.uploaduri222", this.uploaduri);
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
    },
    handleWebsocket(msgid) {
      // UploaderData组件触发该行为，将上传的param参数封装
      // const { taskid } = this.param;
      // data = data || {};
      // let { content, msgid } = data;
      // let content = JSON.parse(content);
      let srcUrl = "";
      let content = this.WebsocketContent
      if (msgid === this.webSocketTaskId) {
        // let promises = content.map(i => getFileByWebsocketCallback(i.subject));
        content.forEach((c, i) => {
          let url;
          if (c.subject.indexOf("file:") >= 0) {
            let files = c.subject.split("file:");
            url = files[1];
          } else {
            url = c.subject;
          }
          srcUrl += i !== content.length - 1 ? `${url},` : `${url}`;
        });
        getFileByWebsocketCallback(srcUrl).then(res => {
          // console.log("res", res, res.data.data);
          this.selectLists = res.data.data;
          // console.warn('这里可以得到', this.selectLists);
          setTimeout(() => {
            this.$refs.layerTransform.addLayer();
          },100);
        });
      }
    }
  }
};
</script>
