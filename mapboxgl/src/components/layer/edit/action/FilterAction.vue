<template>
  <div class="mapgis-mvt-action-filter">
    <mapgis-ui-row class="mapgis-mvt-action-filter-control">
      <div class="mapgis-mvt-action-filter-left">过滤显示</div>
      <div class="mapgis-mvt-action-filter-right">
        启用 <mapgis-ui-switch v-model="enable" />
      </div>
    </mapgis-ui-row>
    <mapgis-ui-divider />
    <div v-if="enable">
      <mapgis-ui-radio-group v-model="type">
        <mapgis-ui-radio value="properties">
          按属性过滤
        </mapgis-ui-radio>
        <mapgis-ui-radio value="geometry" disabled>
          按范围过滤
        </mapgis-ui-radio>
      </mapgis-ui-radio-group>

      <v-jsoneditor
        class="mapgis-mvt-action-filter-json-editor"
        v-model="json"
        :options="options"
        :plus="false"
        height="240px"
        @error="onJsonError"
      />
    </div>
  </div>
</template>

<script>
import VJsoneditor from "v-jsoneditor";

export default {
  name: "mapgis-mvt-action-filter",
  components: { VJsoneditor },
  data() {
    return {
      enable: true,
      type: "properties",
      json: ["all"],
      options: {
        search: false,
        mode: "code"
      }
    };
  },
  watch: {
    enable(next) {
      if (next) {
        this.json = ["all"];
      } else {
      }
    }
  },
  methods: {
    onJsonError(error) {
      console.log("json error", error);
    }
  }
};
</script>

<style>
.mapgis-mvt-action-filter {
}
.mapgis-mvt-action-filter-control {
  margin-top: 20px;
  width: 100%;
}
.mapgis-mvt-action-filter-left {
  float: left;
}
.mapgis-mvt-action-filter-right {
  float: right;
}
.mapgis-mvt-action-filter-json-editor {
  margin-top: 12px;
}
.jsoneditor-container.min-box {
  min-width: 260px !important;
}
</style>
