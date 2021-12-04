<template>
  <div>
    <mapgis-ui-row class="mapgis-ui-project-bottom-panel">
      <mapgis-ui-col span="12">
        <mapgis-ui-button class="mapgis-ui-project-bottom-panel-save" type="primary">保存</mapgis-ui-button>
      </mapgis-ui-col>
      <mapgis-ui-col span="12">
        <mapgis-ui-button @click="$_click" class="mapgis-ui-project-bottom-panel-preview" type="primary">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-bottom-panel",
  methods: {
    $_click() {
      this.$emit("preview");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-bottom-panel {
  width: 100%;
  height: 48px;
  background: #F1F1F1;
  padding: 8px 0;
}

.mapgis-ui-project-bottom-panel-save {
  color: white;
  font-size: 14px;
  width: 96%;
  height: 32px;
  background: #1890FF;
  border-radius: 3px;
}

.mapgis-ui-project-bottom-panel-preview {
  color: #1890FF;
  font-size: 14px;
  width: 96%;
  margin-left: 4%;
  height: 32px;
  background: #FFFFFF;
  border: 1px solid #1890FF;
  border-radius: 3px;
}
</style>