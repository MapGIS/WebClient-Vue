<template>
  <div>
    <mapgis-igs-unique-theme-layer
        v-show="showType === 'unique'"
        :themeDefaultType="themeDefaultType"
        :icons="icons"
        :themeTypeArr="themeType"
        :panelProps="panelProps"
        @loaded="$_uniqueLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    ></mapgis-igs-unique-theme-layer>
    <mapgis-igs-symbol-theme-layer
        v-show="showType === 'symbol'"
        :themeDefaultType="themeDefaultType"
        :icons="icons"
        :themeTypeArr="themeType"
        :panelProps="panelProps"
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
        @loaded="$_rangeLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    ></mapgis-igs-range-theme-layer>
    <mapgis-igs-heat-theme-layer
        v-show="showType === 'heatmap'"
        :themeDefaultType="themeDefaultType"
        :themeTypeArr="themeType"
        :panelProps="panelProps"
        @loaded="$_heatLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    >
    </mapgis-igs-heat-theme-layer>
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
      themeType: undefined
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
        return {
          "circle-opacity": 70,
          "heatmap-radius": 60,
          "select-value": "name",
        }
      }
    }
  },
  mounted() {
    this.$emit("loaded",this);
  },
  methods: {
    resetLayer(layerId){
      this.uniqueLayer.deleteExtraLayer();
      this.symbolLayer.deleteExtraLayer();
      this.rangeLayer.deleteExtraLayer();
      this.heatmapLayer.deleteExtraLayer();
      this.uniqueLayer.resetMainLayer(layerId);
    },
    addThemeLayer(type, layerId){
      let features = this.map.queryRenderedFeatures({layers: [layerId]});
      if(features.length > 0 && features[0].geometry.type !== "Point"){
        this.themeType = [{
          key: "unique",
          value: "单值专题图"
        }, {
          key: "range",
          value: "分段专题图"
        }]
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
    },
    $_addThemeLayer(type, layerId) {
      this.layerId = layerId;
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
      this[this.showType + "Layer"].hideExtraLayer();
      this.$_addThemeLayer(key,this.layerId);
      this[this.showType + "Layer"].showExtraLayer();
    }
  }
}
</script>

<style scoped>

</style>