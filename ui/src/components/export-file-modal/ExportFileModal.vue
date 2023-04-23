<template>
  <mapgis-ui-modal
    class="export-wrapper"
    :visible="visible"
    :title="title"
    :width="360"
    :mask="false"
    @cancel="onExportCancel"
    @ok="onExportOk"
  >
    <div class="export-body">
      <mapgis-ui-space direction="vertical" style="flex: 1">
        <mapgis-ui-row>
          <label>文件名称</label>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-input v-model="exportFileNameCopy"> </mapgis-ui-input>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <label>导出格式</label>
        </mapgis-ui-row>
        <mapgis-ui-row>
          <mapgis-ui-select
            v-model="exportFileTypeCopy"
            style="width: 100%"
            :disabled="exportFileTypes.length < 2"
          >
            <mapgis-ui-select-option
              v-for="item in exportFileTypes"
              :key="item"
            >
              {{ item }}
            </mapgis-ui-select-option>
          </mapgis-ui-select>
        </mapgis-ui-row>
      </mapgis-ui-space>
    </div>
  </mapgis-ui-modal>
</template>

<script>
export default {
  name: "mapgis-ui-export-file-modal",
  data() {
    return {
      exportFileNameCopy: "",
      exportFileTypeCopy: "shp"
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "导出文件"
    },
    exportFileTypes: {
      type: Array,
      default: () => ["shp", "6x", "excel"]
    },
    exportFileName: {
      type: String,
      default: ""
    },
    exportFileType: {
      type: String,
      default: "shp"
    }
  },
  watch: {
    exportFileName: {
      handler: function(val) {
        this.exportFileNameCopy = val;
      },
      deep: true,
      immediate: true
    },
    exportFileType: {
      handler: function(val) {
        this.exportFileTypeCopy = val;
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    onExportCancel() {
      this.$emit("cancel");
    },
    onExportOk() {
      this.$emit("ok", {
        fileName: this.exportFileNameCopy,
        fileType: this.exportFileTypeCopy
      });
    }
  }
};
</script>

<style scoped>
.export-body {
  display: flex;
}
</style>
