<template>
  <div class="mapgis-ui-upload-data">
    <div class="mapgis-ui-uploader-path">
      <p class="mapgis-ui-uploader-path-text" :title="importDestUrl">
        <img src="./images/save.png" style="padding-bottom:4px;" />
        导入到：{{ importDestUrl }}
      </p>
      <!-- <mapgis-ui-button
        type="link"
        style="line-height:40px;float:right;"
        @click="handleImportUrlModal"
      >
        {{ buttonText }}
      </mapgis-ui-button> -->
      <span
        style="line-height:40px;float:right;margin-right:8px;cursor:pointer;"
        @click="handleImportUrlModal"
      >
        {{ buttonText }}
      </span>
    </div>
    <div class="type-radio">
      <mapgis-ui-radio-group
        v-model="importDataType"
        button-style="solid"
        size="large"
      >
        <mapgis-ui-radio-button value="shp">
          Shapefile数据文件
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="json">
          Geojson数据文件
        </mapgis-ui-radio-button>
        <mapgis-ui-radio-button value="csv">
          CSV表格文件
        </mapgis-ui-radio-button>
      </mapgis-ui-radio-group>
    </div>
    <div class="mapgis-ui-upload-data-main" @click="handleImportFile">
      <!-- <img src="./images/upload.png" style="padding-top:40px;" /> -->
      <UploadIcon  class="mapgis-ui-upload-data-svg"/>
      <p style="font-size:16px;">选择文件</p>
    </div>
    <p class="type-desc">{{ typeDescriptions[importDataType] }}</p>
    <mapgis-ui-modal
      v-model="showPathSelect"
      :dialog-style="{ top: '120px' }"
      title="选择导入路径"
      ok-text="确认"
      cancel-text="取消"
      @ok="handlePathOk"
      @cancel="handlePathCancel"
    >
      <mapgis-ui-uploader-foldertree
        v-if="showFolderTree"
        @changePath="changePath"
      />
    </mapgis-ui-modal>
  </div>
</template>

<script>
import MapgisUiUploaderFoldertree from ".//UploaderFolderTree.vue";
import UploadIcon from '../../../svg/MajesticonsCloudUpload'
import UploadMixin from "../../../../mixin/UploaderMixin";
import {
  openUploader,
  changePathUploaduri,
  changeUploadWebsocketTaskId
} from "../../../../util/emit/upload";
import { uuid } from "../../util/uuid";

export default {
  name: "importData",
  mixins: [UploadMixin],
  components: { 
    MapgisUiUploaderFoldertree,
    UploadIcon
  },
  props: {
    importDestUrl: {
      type: String,
      default: ""
    },
    curImportUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      buttonText: "选择/更改位置",
      importDataType: "shp",
      typeDescriptions: {
        shp: ".zip格式，可包含单个或多个shp文件（建议使用rar压缩软件进行压缩）",
        json: "Geojson格式文件(.json、.geojson)",
        csv: "CSV格式表格文件(.csv)，支持经纬度和Web墨卡托坐标系"
      },
      showPathSelect: false,
      showFolderTree: true,
      temUrl: ""
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleImportUrlModal() {
      this.showPathSelect = true;
    },
    changePath(url) {
      this.temUrl = url;
    },
    handlePathOk() {
      changePathUploaduri({ uri: this.temUrl });
      // console.warn("this.uploaduri111", this.uploaduri);
      this.$emit("changePathText", this.temUrl);
      this.showPathSelect = false;
      this.resetTree();
    },
    handlePathCancel() {
      this.$emit("changePathText", "");
      this.resetTree();
    },
    resetTree() {
      this.temUrl = "";
      this.showFolderTree = false;
      this.$nextTick(() => {
        this.showFolderTree = true;
      });
    },
    handleImportFile() {
      if (this.curImportUrl === "") {
        this.$message.error("导入路径未选择");
        return null;
      }
      let type = this.importDataType;
      let gisFormat = type === "tiff" ? "raster" : "vector";
      // 本质上这个点击事件什么都不做，通过这个点击操作==>触发隐藏的全局上传空间的点击事件
      // 打开文件选择框
      let taskid = uuid();

      openUploader({
        param: {
          state: "toggle-click-event", // 传入的参数
          folderDir: this.curImportUrl,
          isCache: false,
          type: type,
          gisFormat: gisFormat,
          isGisImport: this.importDataType !== "csv", // csv不可导入
          taskid: taskid
        }
      });
      console.log('【本次上传对应taskid】', taskid)
      changeUploadWebsocketTaskId({
        webSocketTaskId: taskid
      });
    }
  },
  destroyed() {}
};
</script>

<style scoped>
.mapgis-ui-uploader-path {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  border: 1px solid #dcdfe6b8;
  border-radius: 4px;
}
.mapgis-ui-uploader-path-text {
  display: inline-block;
  max-width: calc(100% - 130px);
  line-height: 40px;
  /* color: #999999; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.type-radio {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}
/* .upload-main {
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 450px;
  height: 180px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
} */
.type-desc {
  width: 450px;
  text-align: center;
  margin: 0 auto;
  color: #999999;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
