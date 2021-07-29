<template>
  <div>
    <div v-for="(panel,index) in panels" :key="index" v-show="panel === layerId && showPanel">
      <mapgis-igs-unique-theme-layer
          v-show="showType === 'unique'"
          :themeDefaultType="themeDefaultType"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_uniqueLoaded"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-unique-theme-layer>
      <mapgis-igs-symbol-theme-layer
          v-show="showType === 'symbol'"
          :themeDefaultType="themeDefaultType"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_symbolLoaded"
          @themeTypeChanged="$_themeTypeChanged"
      >
      </mapgis-igs-symbol-theme-layer>
      <mapgis-igs-range-theme-layer
          v-show="showType === 'range'"
          :themeDefaultType="themeDefaultType"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_rangeLoaded"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-range-theme-layer>
      <mapgis-igs-heat-theme-layer
          v-show="showType === 'heatmap'"
          :themeDefaultType="themeDefaultType"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_heatLoaded"
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

export default {
  name: "mapgis-igs-theme-layer",
  components: {UniqueThemeLayer, RangeThemeLayer, SymbolThemeLayer,HeatThemeLayer},
  inject: ["map"],
  data() {
    return {
      showType: "unique",
      themeDefaultType: "单值专题图",
      layerId: undefined,
      uniqueLayer: undefined,
      symbolLayer: undefined,
      rangeLayer: undefined,
      heatmapLayer: undefined,
      themeType: undefined,
      resetAllLayer: true,
      panels: [],
      showPanel: true
    }
  },
  props: {
    icons: {
      type: Array,
      default(){
        return []
      }
    },
    panelProps: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.$emit("loaded",this);
  },
  methods: {
    $_resetAllLayer(){
      this.hideLayer(this.layerId);
    },
    hideLayer(layerId){
      this.uniqueLayer.hideExtraLayer(layerId);
      this.symbolLayer.hideExtraLayer(layerId);
      this.rangeLayer.hideExtraLayer(layerId);
      this.heatmapLayer.hideExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanel = false;
    },
    resetLayer(layerId){
      this.uniqueLayer.deleteExtraLayer(layerId);
      this.symbolLayer.deleteExtraLayer(layerId);
      this.rangeLayer.deleteExtraLayer(layerId);
      this.heatmapLayer.deleteExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanel = false;
      this.$_showLayerFromHeatMap();
    },
    $_showLayerFromHeatMap(){
      if(this.showType === "heatmap") {
        let paint = window.originLayer[this.layerId].paint;
        let circleOpacity = paint.hasOwnProperty("circle-opacity") ? paint["circle-opacity"] : 1;
        let circleStrokeOpacity = paint.hasOwnProperty("circle-stroke-opacity") ? paint["circle-stroke-opacity"] : 1;
        this.map.setPaintProperty(this.layerId,"circle-opacity",circleOpacity);
        this.map.setPaintProperty(this.layerId,"circle-stroke-opacity",circleStrokeOpacity);
      }
    },
    addThemeLayer(type, layerId){
      let hasPanel = false;
      for (let i = 0;i < this.panels.length;i++){
        if(this.panels[i] === layerId){
          hasPanel = true;
        }
      }
      if(!hasPanel){
        this.panels.push(layerId);
      }
      this.$nextTick(function () {
        let features = this.map.queryRenderedFeatures({layers: [layerId]});
        if(features.length > 0 && features[0].geometry.type !== "Point"){
          this.themeType = [{
            key: "unique",
            value: "单值专题图"
          }, {
            key: "range",
            value: "分段专题图"
          }]
        }else {
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
            this.themeDefaultType = "热力专题图";
            break;
          case "unique":
            this.themeDefaultType = "单值专题图";
            break;
          case "range":
            this.themeDefaultType = "分段专题图";
            break;
          case "symbol":
            this.themeDefaultType = "等级符号专题图";
            break;
        }
        this.$_addThemeLayer(type, layerId);
      })
    },
    $_addThemeLayer(type, layerId) {
      this.layerId = layerId;
      this.showPanel = true;
      switch (type) {
        case "unique":
          this.uniqueLayer.addThemeLayer(layerId);
          break;
        case "symbol":
          this.symbolLayer.addThemeLayer(layerId);
          break;
        case "range":
          this.rangeLayer.addThemeLayer(layerId);
          break;
        case "heatmap":
          this.heatmapLayer.addThemeLayer(layerId);
          break;
      }
      this.showType = type;
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
    $_heatLoaded(heatmapLayer){
      this.heatmapLayer = heatmapLayer;
    },
    $_themeTypeChanged(key,value){
      this.themeDefaultType = value;
      this[this.showType + "Layer"].hideExtraLayer(this.layerId);
      this.$_showLayerFromHeatMap();
      this.$_addThemeLayer(key,this.layerId);
      this[this.showType + "Layer"].showExtraLayer(this.layerId);
    }
  }
}
</script>

<style scoped>

</style>