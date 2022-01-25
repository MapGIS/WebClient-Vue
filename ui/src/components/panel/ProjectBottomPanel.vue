<template>
  <div>
    <mapgis-ui-row v-if="enableSave" class="mapgis-ui-project-bottom-panel">
      <mapgis-ui-col span="12">
        <mapgis-ui-button @click="$_save" class="mapgis-ui-project-bottom-panel-save" type="primary">保存</mapgis-ui-button>
      </mapgis-ui-col>
      <mapgis-ui-col span="12">
        <mapgis-ui-button @click="$_click" class="mapgis-ui-project-bottom-panel-preview mapgis-ui-project-bottom-panel-preview-save" type="primary">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="!enableSave" class="mapgis-ui-project-bottom-panel">
      <mapgis-ui-col span="24">
        <mapgis-ui-button @click="$_click" class="mapgis-ui-project-bottom-panel-preview" type="primary">预览</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-project-bottom-panel",
  props: {
    enableSave: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    $_click() {
      this.$emit("preview");
    },
    $_save() {
      this.$emit("save");
    }
  }
}
</script>

<style scoped>
.mapgis-ui-project-bottom-panel {
  width: 100%;
  height: 48px;
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

.mapgis-ui-project-bottom-panel-preview-save {
  color: #1890FF;
  background: #FFFFFF;
  border: 1px solid #1890FF;
  width: 96%;
}

.mapgis-ui-project-bottom-panel-preview{
  font-size: 14px;
  width: calc(100% - 24px);
  margin-left: 12px;
  height: 32px;
  border-radius: 3px;
}
</style>