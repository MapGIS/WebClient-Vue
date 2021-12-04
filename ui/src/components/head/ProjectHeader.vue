<template>
  <mapgis-ui-row class="mapgis-ui-project-panel-head">
    <mapgis-ui-col span="24">
      <mapgis-ui-input-search placeholder="请输入关键词搜索" @search="$_search" class="mapgis-ui-project-panel-search"/>
    </mapgis-ui-col>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-project-header",
  methods: {
    $_search() {
      this.$emit("search");
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