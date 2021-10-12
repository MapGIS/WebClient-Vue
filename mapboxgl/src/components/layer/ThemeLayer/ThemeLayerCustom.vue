<template>
  <div v-show="showPanel">
    <mapgis-theme-panel-custom
        ref="themePanel"
        :options="optionsCopy"
        @formChanged="$_formChanged"
        @highlightChanged="$_highlightChanged"
    />
    <!--    <mapgis-inspect-->
    <!--        :showMapPopupOnHover=true-->
    <!--        :showInspectMapPopupOnHover=true-->
    <!--        :fields="popUpFields"-->
    <!--        v-if="isPopUpAble"-->
    <!--    />-->
    <!--    <mapgis-marker-->
    <!--        v-if="markers.length > 0"-->
    <!--        :coordinates="markers"-->
    <!--    >-->
    <!--      <div slot="marker" style="background: #ffffff;padding: 6px;border: 3px solid #ccc;border-radius: 3px;">sadasdsadasd</div>-->
    <!--    </mapgis-marker>-->
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
    },
    defaultIcon: {
      type: String,
      default: "useDefault"
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

.mapboxgl-popup-content {
  width: auto;
  padding: 0;
}

.mapgis-theme-popup-container{
  padding: 10px 10px 15px;
}

.mapgis-theme-popup-row {
  text-align: left;
  white-space: nowrap;
  padding: 6px 0;
  font-size: 24px;
  font-weight: bolder;
  height: 40px;
}
.mapgis-theme-popup-item{
  display: inline-block;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.mapgis-theme-popup-colon {
  margin: 0 3px;
}

.mapgis-theme-popup-field {
  min-width: 27%;
}

.mapgis-theme-popup-value {
  width: 70%;
}
</style>