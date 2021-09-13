<template>
  <div>
    <ThemePanel
        ref="themePanel"
        @fieldChanged="$_fieldChanged"
        @themeTypeChanged="$_themeTypeChanged"
        @rangeInputChanged="$_rangeInputChanged"
        @startDataChanged="$_startDataChanged"
        @addRange="$_addRange"
        @deleteRange="$_deleteRange"
        @iconChanged="$_iconChanged"
        @wenliIconChanged="$_wenliIconChanged"
        @colorChanged="$_colorChanged"
        @checked="$_checked"
        @gradientChanged="$_gradientChanged"
        @uniformColorChanged="$_uniformColorChanged"
        @iconOpacityChanged="$_iconOpacityChanged"
        @iconTranslateXChanged="$_iconTranslateXChanged"
        @iconTranslateYChanged="$_iconTranslateYChanged"
        @radiusChanged="$_radiusChanged"
        @radiusIndexChanged="$_radiusIndexChanged"
        @circleOpacityChanged="$_circleOpacityChanged"
        @circleRadiusChanged="$_circleRadiusChanged"
        @circleTranslateXChanged="$_xCircleTranslateChanged"
        @circleTranslateYChanged="$_yCircleTranslateChanged"
        @circleStrokeColorChanged="$_circleStrokeColorChanged"
        @circleStrokeWidthChanged="$_circleStrokeWidthChanged"
        @circleStrokeOpacityChanged="$_circleStrokeOpacityChanged"
        @lineOpacityChanged="$_lineOpacityChanged"
        @lineWidthChanged="$_lineWidthChanged"
        @lineTranslateXChanged="$_lineTranslateXChanged"
        @lineTranslateYChanged="$_lineTranslateYChanged"
        @fillOpacityChanged="$_fillOpacityChanged"
        @fillTranslateXChanged="$_fillTranslateXChanged"
        @fillTranslateYChanged="$_fillTranslateYChanged"
        @fillOutlineColorChanged="$_fillOutlineColorChanged"
        @fillOutlineOpacityChanged="$_fillOutlineOpacityChanged"
        @fillOutlineWidthChanged="$_fillOutlineWidthChanged"
        @textFieldChanged="$_textFieldChanged"
        @textColorChanged="$_textColorChanged"
        @textHaloColorChanged="$_textHaloColorChanged"
        @textHaloWidthChanged="$_textHaloWidthChanged"
        @textFontChanged="$_textFontChanged"
        @textSizeChanged="$_textSizeChanged"
        @textOffsetXChanged="$_textOffsetXChanged"
        @textOffsetYChanged="$_textOffsetYChanged"
        @textLetterSpacingChanged="$_textLetterSpacingChanged"
        @textRotateChanged="$_textRotateChanged"
        @heatmapGradientChanged="$_heatmapGradientChanged"
        @heatmapOpacityChanged="$_heatmapOpacityChanged"
        @heatmapRadiusChanged="$_heatmapRadiusChanged"
    />
  </div>
</template>

<script>
import ThemePanel from "./ThemePanel";
import BaseLayer from "./BaseLayer";

export default {
  name: "mapgis-igs-theme-layer",
  inject: ["map"],
  mixins: [BaseLayer],
  components: {
    ThemePanel
  },
  data() {
    return {}
  },
  props: {},
  mounted() {
    this.$emit("loaded", this);
  },
  methods: {
    /**
     * 添加一个专题图
     * @param layerId 要添加专题图的图层id
     * @param themeType 要添加的专题图类型，默认为unique，单值专题图
     * */
    addThemeLayer(themeType, layerId) {
      this.$_addThemeLayer(themeType, layerId);
    },
    getAllLayer() {
      return this.$_getAllLayer();
    },
    setAllLayer(themes) {
      this.$_setAllLayer(themes);
    },
    resetLayer(layerId){
      this.$_resetAllLayer(layerId);
    },
    hideCurrentLayer(layerId){
      this.$_hideCurrentLayer(layerId);
    },
    showCurrentLayer(layerId){
      this.$_showCurrentLayer(layerId);
    },
    setLayerZoomRange(layerId,minzoom,maxzoom){
      this.$_setLayerZoomRange(layerId,minzoom,maxzoom);
    }
  }
}
</script>

<style scoped>

</style>