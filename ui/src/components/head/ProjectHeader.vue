<template>
  <mapgis-ui-row class="mapgis-ui-project-panel-head">
    <mapgis-ui-col :span="enableImport ? 17 : 24">
      <mapgis-ui-input-search placeholder="请输入关键词搜索" @change="$_search" class="mapgis-ui-project-panel-search"/>
    </mapgis-ui-col>
    <mapgis-ui-col style="margin-left: 6px;" span="4" v-if="enableImport">
      <mapgis-ui-button type="primary" @click="$_import">导入</mapgis-ui-button>
    </mapgis-ui-col>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-project-header",
  props: {
    enableImport: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    $_search(e) {
      this.$emit("search", e);
    },
    $_import() {
      this.$emit("import");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-panel-head {
  width: 100%;
  height: 53px;
  padding-top: 10px;
  padding-left: 7px;
}

.mapgis-ui-project-panel-search{
  width: 98%;
  height: 36px;
  margin-right: 5px;
  border-radius: 3px;
}
</style>