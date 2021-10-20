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