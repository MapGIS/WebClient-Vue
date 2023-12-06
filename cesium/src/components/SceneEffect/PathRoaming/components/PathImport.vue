<template>
  <mapgis-ui-modal
    class="path-import-wrapper"
    :visible="visible"
    :title="title"
    :width="300"
    :mask="false"
    @cancel="onImportCancel"
    @ok="onImportOk"
  >
    <template slot="footer">
      <mapgis-ui-button key="cancel" @click="onImportCancel">
        取消
      </mapgis-ui-button>
      <mapgis-ui-button key="ok" type="primary" @click="onImportOk">
        确定
      </mapgis-ui-button>
    </template>
    <div class="path-import-body">
      <mapgis-ui-row>
        <input
          type="file"
          id="file"
          :accept="`.${importModalType}`"
          @input="readOrUploadFile"
        />
      </mapgis-ui-row>
    </div>
  </mapgis-ui-modal>
</template>

<script>
import axios from "axios";

export default {
  name: "path-import",
  inject: ["ip", "port"],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 弹框的类型，json或wl，表示导入json文件或是上传wl文件
    importModalType: {
      type: String,
      default: ""
    }
  },
  computed: {
    title() {
      return this.importModalType === "json" ? "导入漫游路径" : "上传文件";
    }
  },
  data() {
    return {
      data: null,
      node: null
    };
  },
  methods: {
    onImportCancel() {
      this.node = null;
      this.data = null;
      this.$emit("close-path-import-modal", false);
    },
    onImportOk() {
      this.$emit("close-path-import-modal", false);
      if (this.importModalType === "json") {
        this.$emit("update-paths", this.data);
      } else {
        this.$emit("update-wl", this.node);
      }
    },
    // 读取json文件或者上传wl文件
    readOrUploadFile(e) {
      if (this.importModalType === "json") {
        this.readImportFile(e);
      } else {
        this.uploadFile(e);
      }
    },
    async uploadFile(e) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("files", file);
      try {
        const res = await this.uploadRequest(formData);
        if (res.status === 200) {
          const result = await this.featureQuery(res.data.uploadFiles[0].path);
          this.node = {
            path: result.data.features[0].geometry.coordinates
              .join(",")
              .split(","),
            name: result.data.name.split(".")[0]
          };
        }
      } catch {}
    },
    uploadRequest(param) {
      return axios.post(
        `${window.location.protocol}//${this.ip}:${this.port}/igs/rest/services/system/ResourceServer/files`,
        param,
        { headers: { "Content-type": "multipart/form-data" } }
      );
    },
    featureQuery(path) {
      return axios.get(
        `${window.location.protocol}//${this.ip}:${this.port}/igs/rest/services/system/ResourceServer/tempData/features/query?f=json&url=${path}`
      );
    },
    // 读取json文件
    readImportFile(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        const data = JSON.parse(e.target.result);
        this.data = data;
      };
    }
  }
};
</script>
