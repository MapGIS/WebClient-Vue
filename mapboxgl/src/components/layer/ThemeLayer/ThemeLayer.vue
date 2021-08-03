<template>
  <div>
    <div v-for="(panel,index) in panels" :key="index" v-show="panel === layerId && showPanelFlag">
      <mapgis-igs-unique-theme-layer
          v-show="showType === 'unique'"
          :themeDefaultType="themeDefaultType"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanel"
          @createLayerFailed="$_createLayerFailed"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_uniqueLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-unique-theme-layer>
      <mapgis-igs-symbol-theme-layer
          v-show="showType === 'symbol'"
          :themeDefaultType="themeDefaultType"
          :icons="icons"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanel"
          @createLayerFailed="$_createLayerFailed"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_symbolLoaded"
          @closePanel="$_closeAllPanel"
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
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanel"
          @createLayerFailed="$_createLayerFailed"
          @resetAllLayer="$_resetAllLayer"
          @loaded="$_rangeLoaded"
          @closePanel="$_closeAllPanel"
          @themeTypeChanged="$_themeTypeChanged"
      ></mapgis-igs-range-theme-layer>
      <mapgis-igs-heat-theme-layer
          v-show="showType === 'heatmap'"
          :themeDefaultType="themeDefaultType"
          :themeTypeArr="themeType"
          :panelProps="panelProps"
          :resetAllLayer="resetAllLayer"
          :iconUrl="iconUrlCopy"
          :closeAllPanel="closeAllPanel"
          @createLayerFailed="$_createLayerFailed"
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
      showPanelFlag: true,
      closeAllPanel: true,
      iconUrlCopy: undefined
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
    },
    iconUrl: {
      type: String
    }
  },
  mounted() {
    this.$emit("loaded",this);
    this.iconUrlCopy = this.map.getStyle().sprite;
  },
  methods: {
    $_createLayerFailed(message){
      this.$emit("createLayerFailed",message);
    },
    $_resetAllLayer(){
      this.hideLayer(this.layerId);
    },
    hideLayer(layerId){
      this.uniqueLayer.hideExtraLayer(layerId);
      this.symbolLayer.hideExtraLayer(layerId);
      this.rangeLayer.hideExtraLayer(layerId);
      this.heatmapLayer.hideExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanelFlag = false;
    },
    resetLayer(layerId){
      this.uniqueLayer.deleteExtraLayer(layerId);
      this.symbolLayer.deleteExtraLayer(layerId);
      this.rangeLayer.deleteExtraLayer(layerId);
      this.heatmapLayer.deleteExtraLayer(layerId);
      this.uniqueLayer.resetMainLayer(layerId);
      this.showPanelFlag = false;
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
    },
    $_addThemeLayer(type, layerId) {
      let vm = this;
      setTimeout(function () {
        vm.layerId = layerId;
        vm.showPanelFlag = true;
        switch (type) {
          case "unique":
            vm.uniqueLayer.addThemeLayer(layerId);
            break;
          case "symbol":
            vm.symbolLayer.addThemeLayer(layerId);
            break;
          case "range":
            vm.rangeLayer.addThemeLayer(layerId);
            break;
          case "heatmap":
            vm.heatmapLayer.addThemeLayer(layerId);
            break;
        }
        vm.showType = type;
      },300)
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
    $_closeAllPanel(){
      this.showPanelFlag = false;
      this.$emit("closePanel",this.layerId)
    },
    closePanel(){
      this.$_closeAllPanel();
    },
    $_showPanel() {
      this.showPanelFlag = true;
      this.$emit("showPanel",this.layerId)
    },
    showPanel(){
      this.$_showPanel();
    },
    $_themeTypeChanged(key,value){
      this.themeDefaultType = value;
      this[this.showType + "Layer"].hideExtraLayer(this.layerId);
      this.$_addThemeLayer(key,this.layerId);
      this[this.showType + "Layer"].showExtraLayer(this.layerId);
    }
  }
}
</script>

<style scoped>

</style>