<template>
  <div>
    <div v-for="(panel,index) in panels" :key="index" v-show="panel === ThemeLayerId && showPanelFlag">
      <mapgis-igs-unique-theme-layer
          v-show="showType === 'unique'"
          :themeDefaultType="themeDefaultTypeFlag"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayerFlag"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanelProps"
          @createLayerFailed="$_createLayerFailed"
          @hasNullProperty="$_hasNullProperty"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_uniqueLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-unique-theme-layer>
      <mapgis-igs-symbol-theme-layer
          v-show="showType === 'symbol'"
          :themeDefaultType="themeDefaultTypeFlag"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayerFlag"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanelProps"
          @createLayerFailed="$_createLayerFailed"
          @hasNullProperty="$_hasNullProperty"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_symbolLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      >
      </mapgis-igs-symbol-theme-layer>
      <mapgis-igs-range-theme-layer
          v-show="showType === 'range'"
          :themeDefaultType="themeDefaultTypeFlag"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayerFlag"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanelProps"
          @createLayerFailed="$_createLayerFailed"
          @hasNullProperty="$_hasNullProperty"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_rangeLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-range-theme-layer>
      <mapgis-igs-heat-theme-layer
          v-show="showType === 'heatmap'"
          :themeDefaultType="themeDefaultTypeFlag"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayerFlag"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanelProps"
          @createLayerFailed="$_createLayerFailed"
          @hasNullProperty="$_hasNullProperty"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_heatLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      >
      </mapgis-igs-heat-theme-layer>
    </div>

  </div>
</template>

<script>
import UniqueThemeLayer from "./UniqueThemeLayer.vue";
import RangeThemeLayer from "./RangeThemeLayer.vue";
import SymbolThemeLayer from "./SymbolThemeLayer.vue";
import HeatThemeLayer from "./HeatThemeLayer.vue";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-theme-layer",
  components: {UniqueThemeLayer, RangeThemeLayer, SymbolThemeLayer, HeatThemeLayer},
  inject: ["map"],
  mixins: [BaseLayer],
  data() {
    return {
      showType: "unique",
      themeDefaultTypeFlag: "单值专题图",
      ThemeLayerId: undefined,
      uniqueLayer: undefined,
      symbolLayer: undefined,
      rangeLayer: undefined,
      heatmapLayer: undefined,
      themeType: undefined,
      resetAllLayerFlag: true,
      panels: [],
      showPanelFlag: true,
      closeAllPanelProps: true,
      iconUrlCopy: undefined
    }
  },
  props: {
    icons: {
      type: Array,
      default() {
        return []
      }
    },
    panelProps: {
      type: Object,
      default() {
        return {}
      }
    },
    iconUrl: {
      type: String
    }
  },
  mounted() {
    this.$emit("loaded", this);
    this.iconUrlCopy = this.map.getStyle().sprite;
  },
  methods: {
    setLayerZoomRange(layerId,minzoom,maxzoom){
      if(window.originLayer && window.originLayer.layerOrder){
        let layerOrder = window.originLayer.layerOrder;
        for (let i =0;i< layerOrder.length;i++){
          if(layerOrder[i].indexOf(layerId) > -1 && layerOrder[i] !== layerId){
            this.map.setLayerZoomRange(layerOrder[i],minzoom,maxzoom);
            window.originLayer[layerId][layerOrder[i]].minzoom = minzoom;
            window.originLayer[layerId][layerOrder[i]].maxzoom = maxzoom;
          }
        }
      }
    },
    setAllLayer(themes) {
      let vm = this;
      vm.$_setAllLayer(themes);
    },
    $_setAllLayer(themes) {
      if (!window._workspace) {
        window._workspace = {};
        window._workspace._layerTypes = {};
      }
      window.originLayer = themes;
      let layerOrder = window.originLayer.layerOrder;
      let originLayerIds = [],originLayerId = undefined;
      for (let i =0;i< layerOrder.length;i++){
        if(layerOrder[i].indexOf("专题图") < 0){
          window._workspace._layerTypes[layerOrder[i]] = window.originLayer[layerOrder[i]].themeType;
          originLayerIds.push(layerOrder[i]);
        }
      }
      let vm = this;
      let interval = setInterval(function () {
        let initAllSource = true;
        for (let i = 0;i<originLayerIds.length;i++){
          let sourceId = window.originLayer[originLayerIds[i]][originLayerIds[i]].source;
          if(!vm.map.getSource(sourceId)){
            initAllSource = false;
          }
        }
        if(initAllSource){
          for (let i =0;i< layerOrder.length;i++){
            if(layerOrder[i].indexOf("专题图") < 0){
              originLayerId = layerOrder[i];
            }else {
              let index = originLayerIds.indexOf(originLayerId);
              let beforeLayer = index === originLayerIds.length - 1 ? undefined : originLayerIds[index + 1];
              vm.map.addLayer(window.originLayer[originLayerId][layerOrder[i]],beforeLayer);
            }
          }
          for (let i =0;i< originLayerIds.length;i++){
            switch (window.originLayer[originLayerIds[i]][originLayerIds[i]].type) {
              case "fill":
                vm.$_setPaintProperty(
                    "fill-opacity",
                    0,
                    originLayerIds[i],
                    window.originLayer[originLayerIds[i]][originLayerIds[i]],
                    originLayerIds[i]
                );
                this.$_setPaintProperty(
                    "fill-outline-color",
                    "rgba(255, 255, 255, 0)",
                    originLayerIds[i],
                    window.originLayer[originLayerIds[i]][originLayerIds[i]],
                    originLayerIds[i]
                );
                break;
              case "line":
                vm.$_setPaintProperty(
                    "line-opacity",
                    0,
                    originLayerIds[i],
                    window.originLayer[originLayerIds[i]][originLayerIds[i]],
                    originLayerIds[i]
                );
                break;
              case "circle":
                vm.$_setPaintProperty(
                    "circle-opacity",
                    0,
                    originLayerIds[i],
                    window.originLayer[originLayerIds[i]][originLayerIds[i]],
                    originLayerIds[i]
                );
                vm.$_setPaintProperty(
                    "circle-stroke-opacity",
                    0,
                    originLayerIds[i],
                    window.originLayer[originLayerIds[i]][originLayerIds[i]],
                    originLayerIds[i]
                );
                break;
            }
          }
          clearInterval(interval);
        }
      },100);
    },
    getAllLayer() {
      return this.$_getAllLayer();
    },
    $_getAllLayer() {
      let allLayer = {...window.originLayer}, newAllLayer = {};
      Object.keys(allLayer).forEach(function (key) {
        if (allLayer[key] instanceof Array) {
          newAllLayer[key] = allLayer[key];
        } else if (allLayer[key] instanceof Object) {
          newAllLayer[key] = {};
          Object.keys(allLayer[key]).forEach(function (layerKey) {
            if (allLayer[key].hasOwnProperty(layerKey) && layerKey.indexOf("_features") < 0) {
              newAllLayer[key][layerKey] = {};
              Object.keys(allLayer[key][layerKey]).forEach(function (paintKey) {
                if(paintKey.indexOf("_") < 0){
                  newAllLayer[key][layerKey][paintKey] = allLayer[key][layerKey][paintKey];
                }
              });
            }
          });
        }
      });
      return newAllLayer;
    },
    $_createLayerFailed(message) {
      this.$emit("createLayerFailed", message);
    },
    $_hasNullProperty(fields) {
      this.$emit("hasNullProperty", fields);
    },
    $_resetAllLayer() {
      this.hideLayer(this.ThemeLayerId);
    },
    hideLayer(layerId) {
      this.uniqueLayer.hideExtraLayer(layerId);
      this.symbolLayer.hideExtraLayer(layerId);
      this.rangeLayer.hideExtraLayer(layerId);
      this.heatmapLayer.hideExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanelFlag = false;
    },
    hideCurrentLayer(layerId) {
      if(this[window._workspace._layerTypes[layerId] + "Layer"]){
        this[window._workspace._layerTypes[layerId] + "Layer"].hideExtraLayer(layerId);
      }else{
        this.hideExtraLayer(layerId,window._workspace._layerTypes[layerId]);
      }
    },
    showCurrentLayer(layerId) {
      if(this[window._workspace._layerTypes[layerId] + "Layer"]){
        this[window._workspace._layerTypes[layerId] + "Layer"].showExtraLayer(layerId);
      }else {
        this.showExtraLayer(layerId,window._workspace._layerTypes[layerId]);
      }
    },
    resetLayer(layerId) {
      this.uniqueLayer.deleteExtraLayer(layerId);
      this.symbolLayer.deleteExtraLayer(layerId);
      this.rangeLayer.deleteExtraLayer(layerId);
      this.heatmapLayer.deleteExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanelFlag = false;
    },
    addThemeLayer(type, layerId,minzoom,maxzoom) {
      let hasPanel = false;
      type = type || window._workspace._layerTypes[layerId];
      for (let i = 0; i < this.panels.length; i++) {
        if (this.panels[i] === layerId) {
          hasPanel = true;
        }
      }
      if (!hasPanel) {
        this.panels.push(layerId);
      }
      let features = this.map.queryRenderedFeatures({layers: [layerId]});
      if (features.length > 0 && features[0].geometry.type !== "Point") {
        this.themeType = [{
          key: "unique",
          value: "单值专题图"
        }, {
          key: "range",
          value: "分段专题图"
        }]
      } else {
        this.themeType = [{
          key: "unique",
          value: "单值专题图"
        }, {
          key: "range",
          value: "分段专题图"
        }, {
          key: "symbol",
          value: "等级符号专题图"
        }, {
          key: "heatmap",
          value: "热力专题图"
        }];
      }
      switch (type) {
        case "heatmap":
          this.themeDefaultTypeFlag = "热力专题图";
          break;
        case "unique":
          this.themeDefaultTypeFlag = "单值专题图";
          break;
        case "range":
          this.themeDefaultTypeFlag = "分段专题图";
          break;
        case "symbol":
          this.themeDefaultTypeFlag = "等级符号专题图";
          break;
      }
      this.$_addThemeLayer(type, layerId,minzoom,maxzoom);
    },
    $_addThemeLayer(type, layerId,minzoom,maxzoom) {
      let vm = this;
      setTimeout(function () {
        vm.ThemeLayerId = layerId;
        vm.showPanelFlag = true;
        switch (type) {
          case "unique":
            vm.uniqueLayer.addThemeLayer(layerId,minzoom,maxzoom);
            break;
          case "symbol":
            vm.symbolLayer.addThemeLayer(layerId,minzoom,maxzoom);
            break;
          case "range":
            vm.rangeLayer.addThemeLayer(layerId,minzoom,maxzoom);
            break;
          case "heatmap":
            vm.heatmapLayer.addThemeLayer(layerId,minzoom,maxzoom);
            break;
        }
        vm.showType = type;
      }, 300)
    },
    $_uniqueLoaded(uniqueLayer) {
      this.uniqueLayer = uniqueLayer;
    },
    $_symbolLoaded(symbolLayer) {
      this.symbolLayer = symbolLayer;
    },
    $_rangeLoaded(rangeLayer) {
      this.rangeLayer = rangeLayer;
    },
    $_heatLoaded(heatmapLayer) {
      this.heatmapLayer = heatmapLayer;
    },
    $_closeAllPanel() {
      this.showPanelFlag = false;
      this.$emit("closePanel", this.ThemeLayerId)
    },
    closePanel() {
      this.$_closeAllPanel();
    },
    $_showPanel() {
      this.showPanelFlag = true;
      this.$emit("showPanel", this.ThemeLayerId)
    },
    showPanel() {
      this.$_showPanel();
    },
    $_themeTypeChanged(key, value) {
      this.themeDefaultTypeFlag = value;
      this[this.showType + "Layer"].hideExtraLayer(this.ThemeLayerId);
      this.showPanelFlag = true;
      switch (key) {
        case "unique":
          this.uniqueLayer.addThemeLayer(this.ThemeLayerId);
          break;
        case "symbol":
          this.symbolLayer.addThemeLayer(this.ThemeLayerId);
          break;
        case "range":
          this.rangeLayer.addThemeLayer(this.ThemeLayerId);
          break;
        case "heatmap":
          this.heatmapLayer.addThemeLayer(this.ThemeLayerId);
          break;
      }
      this.showType = key;
      this[this.showType + "Layer"].showExtraLayer(this.ThemeLayerId);
    }
  }
}
</script>

<style scoped>

</style>