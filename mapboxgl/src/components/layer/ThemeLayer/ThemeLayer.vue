<template>
  <div>
    <mapgis-igs-unique-theme-layer
        v-show="showType === 'unique'"
        :themeDefaultType="themeDefaultType"
        :icons="icons"
        :themeTypeArr="themeType"
        @loaded="$_uniqueLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    ></mapgis-igs-unique-theme-layer>
    <mapgis-igs-symbol-theme-layer
        v-show="showType === 'symbol'"
        :themeDefaultType="themeDefaultType"
        :icons="icons"
        :themeTypeArr="themeType"
        @loaded="$_symbolLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    >
    </mapgis-igs-symbol-theme-layer>
    <mapgis-igs-range-theme-layer
        v-show="showType === 'range'"
        :themeDefaultType="themeDefaultType"
        :icons="icons"
        :themeTypeArr="themeType"
        @loaded="$_rangeLoaded"
        @themeTypeChanged="$_themeTypeChanged"
    ></mapgis-igs-range-theme-layer>
  </div>
</template>

<script>
import UniqueThemeLayer from "./UniqueThemeLayer.vue";
import RangeThemeLayer from "./RangeThemeLayer.vue";
import SymbolThemeLayer from "./SymbolThemeLayer.vue";

export default {
  name: "mapgis-igs-theme-layer",
  components: {UniqueThemeLayer, RangeThemeLayer, SymbolThemeLayer},
  inject: ["map"],
  data() {
    return {
      showType: "unique",
      themeDefaultType: "单值专题图",
      layerId: undefined,
      uniqueLayer: undefined,
      symbolLayer: undefined,
      rangeLayer: undefined,
      themeType: undefined
    }
  },
  props: {
    icons: {
      type: Array,
      default(){
        return []
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