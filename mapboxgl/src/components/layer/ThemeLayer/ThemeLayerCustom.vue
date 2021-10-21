<template>
  <div v-show="showPanel">
    <mapgis-theme-panel-custom
        ref="themePanel"
        :options="optionsCopy"
        @formChanged="$_formChanged"
        @highlightChanged="$_highlightChanged"
    />
    <slot name="legend" :colors="legendColors">
      <div class="mapgis-theme-legend" :class="legendOptionCopy.class.containerClass" v-if="enableLegend"
           :style="legendOptionCopy.style.containerStyle">
        <div class="mapgis-theme-legend-title" :class="legendOptionCopy.class.titleClass" :style="legendOptionCopy.style.titleStyle">
          {{ legendOptionCopy.title }}
        </div>
        <div class="mapgis-theme-legend-row" :class="legendOptionCopy.class.rowClass" :style="legendOptionCopy.style.rowStyle" :key="index"
             v-for="(color, index) in legendColors">
          <div class="mapgis-theme-legend-color" :class="legendOptionCopy.class.legendClass" :style="{background: color, ...legendOptionCopy.style.legendStyle}"></div>
          <div class="mapgis-theme-legend-content" :class="legendOptionCopy.class.labelClass" :style="legendOptionCopy.style.labelStyle">
            {{ legendOptionCopy.fields[index] }}
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import BaseLayer from "./BaseLayer";
import gradients from "./gradient";

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
      legendColors: undefined,
    }
  },
  created() {
    this.panelType = "custom";
  },
  mounted() {
    const {layerStyle} = this.themeOption;
    let colors = layerStyle.color || gradients[0].key;
    this.legendColors = colors.split(",");
    this.legendOptionCopy = Object.assign(this.legendOptionCopy, this.legendOption);
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

.mapgis-theme-legend {
  width: 300px;
  height: 306px;
  border: 2px solid grey;
  border-radius: 4px;
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1;
}

.mapgis-theme-legend-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 8px;
}

.mapgis-theme-legend-row {
  margin-top: 12px;
  height: 40px;
}

.mapgis-theme-legend-color {
  width: 39%;
  height: 40px;
  float: left;
  margin-left: 27px;
}

.mapgis-theme-legend-content {
  width: 50%;
  height: 40px;
  float: left;
  font-size: 20px;
  font-weight: bold;
  padding-top: 10px;
}
</style>