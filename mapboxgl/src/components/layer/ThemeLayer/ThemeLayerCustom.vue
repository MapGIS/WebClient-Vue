<template>
  <div v-show="showPanel">
    <mapgis-theme-panel-custom
        ref="themePanel"
        :options="optionsCopy"
        @formChanged="$_formChanged"
        @highlightChanged="$_highlightChanged"
    />
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-theme-layer-custom",
  mixins: [BaseLayer],
  props: {
    popUpFields: {
      type: Array
    },
    showPanel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      optionsCopy: undefined,
    }
  },
  created() {
    this.panelType = "custom";
  },
  mounted() {
  },
  methods: {
    $_highlightChanged(id) {
      this.$emit("highlightChanged", id);
    },
    $_formChanged(id, value, type, extra, extra2) {
      if (type === "MapgisUiThemeListCheckBox") {
        this.$_checked(extra, value, extra2);
      } else if (type === "MapgisUiThemeListColor") {
        this.$_colorChanged(value, id);
      } else {
        this["$_" + id + "Changed"](value);
      }
    },
    resetLayer(layerId) {
      this.$_deleteThemeLayerByGeoJSON(layerId);
    },
    hideCurrentLayer(layerId) {
      this.$_hideCurrentLayer(layerId);
    },
    showCurrentLayer(layerId) {
      this.$_showCurrentLayer(layerId);
    },
    setHeightLightLayerByIndex(index) {
      this.$_setHeightLightLayerByIndex(index);
    },
    deleteHeightLightLayerByIndex(index) {
      this.$_deleteHeightLightLayerByIndex(index);
    }
  }
}
</script>

<style>
.popup-content {
  width: auto;
}

.mapgis-theme-popup-container {
  padding: 10px 12px 20px 12px;
}

.mapgis-theme-popup-row:nth-child(2n + 2) {
  background-color: rgb(231, 232, 233);
}

.mapgis-theme-popup-row:nth-child(2n + 3) {
  background-color: rgb(244, 244, 244);
}

.mapgis-theme-popup-row:nth-child(2n + 2):hover, .mapgis-theme-popup-row:nth-child(2n + 3):hover {
  background-color: rgb(220, 235, 254);
  border-left: 2px solid rgb(115, 176, 251);
}

.mapgis-theme-popup-row {
  text-align: left;
  white-space: nowrap;
  padding: 6px 12px;
  height: 25px;
  line-height: 11px;
  min-width: 240px;
  border-left: 2px solid rgba(115, 176, 251, 0);
}

.mapgis-theme-popup-title {
  color: rgb(178, 178, 178);
  font-weight: bold;
  border-bottom: 1px solid rgb(232, 232, 232);
  padding: 6px 0;
  line-height: 8px;
  height: 28px;
  margin-bottom: 3px;
}

.mapgis-theme-popup-item {
  display: inline-block;
  line-height: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.mapgis-theme-popup-field {
  width: 30%;
}

.mapgis-theme-popup-value {
  width: 70%;
  text-align: right;
}

.mapgis-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.3;
  z-index: 1;
}

.mapgis-ui-spin-loading {
  z-index: 10;
  top: 50%;
  left: 50%;
}
</style>