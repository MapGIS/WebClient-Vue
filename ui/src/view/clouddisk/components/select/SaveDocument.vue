<template>
  <div class="mapgis-ui-clouddisk-save-document">
    <mapgis-ui-form-model :layout="layout" :model="saveForm">
      <mapgis-ui-form-model-item label="保存方式">
        <mapgis-ui-select
          v-model="saveType"
          placeholder="请选择保存方式"
          @change="handleSaveType"
        >
          <mapgis-ui-select-option v-for="(type,index) in saveTypeList" :key="index" :value="type.value">
            {{type.label}}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-form-model-item>
      <mapgis-ui-divider />
      <mapgis-ui-form-model-item label="文件路径" v-if="saveType==='directSave'">
        <mapgis-ui-input
          disabled
          v-model="saveForm.saveShowUrl"
          read-only
          placeholder="请选择路径"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="文件路径" v-else>
        <mapgis-ui-input-search
          v-model="saveForm.saveShowUrl"
          read-only
          enter-button
          placeholder="请选择路径"
          @click="handleSaveModal"
          @search="handleSaveModal"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="文件名称">
        <mapgis-ui-input :addon-after="fileType" v-model="saveForm.fileName" :disabled="saveType==='directSave'" />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item>
        <mapgis-ui-button
          class="mapgis-ui-clouddisk-save-document-button"
          type="primary"
          :loading="saveloading"
          @click="handleSaveDocument"
          v-if="layout == 'vertical'"
        >
          <span v-if="saveType==='directSave'">保存</span>
          <span v-else>另存</span>
        </mapgis-ui-button>
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>

    <mapgis-ui-modal
      title="选择导出路径"
      class="modal-add-clouddisk"
      :width="800"
      :dialog-style="{ top: '180px' }"
      :visible="saveTree"
      @ok="handleFolderConfirm"
      @cancel="handleFolderCancel"
    >
      <mapgis-ui-clouddisk-dataselect
        mode="save"
        :onlyFolder="true"
        :multiDatas="false"
        @change="handleFolderChange"
      />
    </mapgis-ui-modal>
  </div>
</template>

<script>
import { saveJsonFile, getFileDownloadUrlWithAuth } from "../../axios/files";
import { getMapGISUrl, getMapgisPath } from "../../config/mapgis";

export default {
  name: "mapgis-ui-clouddisk-savedocument",
  components: {},
  data() {
    return {
      saveForm: {
        saveUrl: "",
        saveShowUrl: "",
        fileName: "默认地图文档"
      },
      saveType: 'directSave',
      saveTypeList: [
        {
          label: '直接保存',
          value: 'directSave'
        },
        {
          label: '另存',
          value: 'otherSave'
        },
      ],
      saveTree: false,
      temUrl: "",
      // form: this.$form.createForm(this, { name: 'save' }),
      mapstudioUrlMark:
        window.localStorage.getItem("mapgis_clouddisk_mapstudioUrlMark") ||
        "/mapstudioweb/#/?share=",
      saveloading: false
    };
  },
  computed: {},
  props: {
    layout: {
      type: String,
      default: "horizontal" // 'horizontal'|'vertical'|'inline'
    },
    fileType: {
      type: String,
      default: ".style"
    },
    currentDocumentStr: {
      type: String,
      default: ""
    }
    // onlyFolder: {
    //   type: Boolean,
    //   default: false
    // },
    // curTiffUrl: {
    //   type: String,
    //   default: ""
    // },
    // tiffListsObj: {
    //   type: Object,
    //   default: () => {
    //     return {};
    //   }
    // },
    // currentDocument: Object,
    // isLayers: {
    //   type: Boolean,
    //   default: true
    // },
    // handleNewDocument: Function
  },
  created () {
    this.getDefaultSavePath()
  },
  watch: {},
  methods: {
    getDefaultSavePath () {
      let savePath = window.localStorage.getItem('mapgis_clouddisk_save_path')
      let saveName = window.localStorage.getItem('mapgis_clouddisk_save_name')

      if (!savePath || savePath === '') {
        this.saveType = 'otherSave'
        this.saveTypeList = [{
          label: '另存',
          value: 'otherSave'
        }]
      }
      this.saveForm.saveUrl = savePath || ''
      this.saveForm.saveShowUrl = this.modefyUrl(this.saveForm.saveUrl)
      this.saveForm.fileName = saveName || '默认地图文档'
    },
    modefyUrl (url) {
      if (url === '') {
        return ''
      }
      let rootUrl = url.split('/')[0]
      let rootName = '常规文件夹'
      if (rootUrl !== getMapgisPath()) {
        rootName = '组织文件夹'
      }
      let rootIndex = url.indexOf("/");
      if (rootIndex >= 0) {
        url = rootName + url.slice(rootIndex);
      } else {
        url = rootName;
      }
      return url;
    },
    handleSaveDocument() {
      const vm = this;
      this.$emit("emitDocumentSaveThemeLayer");
      this.saveloading = true;
      window.setTimeout(() => {
        if (this.saveForm.saveUrl === "" || this.saveForm.fileName === "") {
          this.$notification.error({
            message: "信息未填写完整",
            description: "请将所有项填写完整"
          });
          vm.saveloading = false;
          this.$emit("handleLoading", true);
          this.$nextTick(() => {
            this.$emit("handleLoading", false);
          });
        } else {
          let folderDir, fileName;
          folderDir = this.saveForm.saveUrl;
          fileName = this.saveForm.fileName + this.fileType;
          let json = JSON.parse(this.currentDocumentStr);
          let srcUrl = folderDir + "/" + fileName;
          let fileAttribute = JSON.stringify(this.getFileAttr(json, srcUrl));
          fileAttribute = encodeURIComponent(fileAttribute);
          saveJsonFile(folderDir, fileName, fileAttribute, json) // 自动将最新document以style为类型存回云盘
            .then(res => {
              if (res.status === 200) {
                let result = res.data;
                let { errorCode, msg } = result;
                if (errorCode < 0) {
                  this.$notification.error({
                    message: errorCode,
                    description: msg
                  });
                  vm.saveloading = false;
                  this.$emit("handleLoading", true);
                  this.$nextTick(() => {
                    this.$emit("handleLoading", false);
                  });
                } else {
                  vm.saveloading = false;
                  this.$notification.success({ message: "保存成功！" });
                  // this.saveForm.saveUrl = ''
                  this.$emit("closeDialog");
                }
              }
            })
            .catch(error => {
              this.$notification.error({
                message: "网络异常,请检查链接",
                description: error
              });
              vm.saveloading = false;
              this.$emit("handleLoading", true);
              this.$nextTick(() => {
                this.$emit("handleLoading", false);
              });
            });
        }
      }, 1000)
      
    },
    handleSaveType (value) {
      if (value === 'directSave') {
        this.getDefaultSavePath()
      }
    },
    handleSaveModal() {
      this.saveTree = true;
    },
    handleFolderChange(url) {
      this.temUrl = url;
    },
    handleFolderConfirm() {
      this.saveForm.saveUrl = this.temUrl;
      this.saveForm.saveShowUrl = this.modefyUrl(this.saveForm.saveUrl)
      this.saveTree = false;
    },
    handleFolderCancel() {
      this.saveTree = false;
      // this.saveForm.saveUrl = '' // 这里有待考虑
    },
    getFileAttr(doc, url) {
      let fileAttr = {};
      fileAttr.baseUrl = getMapGISUrl();
      fileAttr.preview = this.getEncodePreviewUrl(url);

      let {
        crs = { epsg: "EPSG_4326" },
        maxBounds = { west: -180, east: 180, south: -90, north: 90 }
      } = doc;

      fileAttr.crs = crs;
      fileAttr.xmin = maxBounds.west || -180;
      fileAttr.xmax = maxBounds.east || 180;
      fileAttr.ymin = maxBounds.south || -90;
      fileAttr.ymax = maxBounds.north || 90;
      // fileAttr.center = doc.center || [0, 0]
      return fileAttr;
    },
    getEncodePreviewUrl(url) {
      let result;
      let baseProjectUrl = getFileDownloadUrlWithAuth(url, false);
      let projectUrl = Buffer.from(baseProjectUrl, "utf-8").toString("base64"); // 编码方式
      projectUrl = encodeURIComponent(projectUrl);
      result = this.mapstudioUrlMark + projectUrl;
      return result;
    }
  }
};
</script>

<style></style>
