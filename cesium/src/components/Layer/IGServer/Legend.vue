<template>
  <div v-if="enableLegend">
    <slot name="legend" :colors="legendColors">
      <div class="mapgis-theme-legend-3d" :class="legend.class.containerClass" :style="legend.style.containerStyle">
        <div class="mapgis-theme-legend-title-3d" :class="legend.class.titleClass" :style="legend.style.titleStyle">
          {{ legend.title }}
        </div>
        <div class="mapgis-theme-legend-row-3d" :class="legend.class.rowClass" :style="legend.style.rowStyle" :key="index" v-for="(item, index) in legend.fields">
          <div class="mapgis-theme-legend-color-3d" v-if="isSvg == false" :class="legend.class.symbolClass" :style="{background: item.color, ...legend.style.symbolStyle}" :data-index="index" @click="legendClick"></div>
          <div class="mapgis-theme-legend-svg-3d" v-if="isSvg == true">
            <img :src="item.source" />
          </div>
          <div class="mapgis-theme-legend-content-3d" :class="legend.class.labelClass" :style="legend.style.labelStyle">
            {{ item.label }}
          </div>
        </div>
        <div class="mapgis-theme-legend-bottom-3d" :class="legend.class.bottomClass" :style="legend.style.bottomStyle"></div>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "mapgis-theme-legend",
  props: {
    // 专题图渲染规则
    renderer: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 专题图图例信息
    rendererInfo: {
      type: Object,
      default: function() {
        return {
          title: "title",
          // fields: [{label: "value", color: "#ff0000"}],
          fields: [],
        }
      }
    },
    // 是否开启图例
    enableLegend: {
      type: Boolean,
      default: false
    },
    // 交互样式，长度大于等于图例项
    symbolList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    enableLegend: {
      handler: function () {
      },
    },
  },
  data() {
    return {
      // 根据传入renderer构造出的图例信息
      rendererInfoCopy: {},
      // 最终生成的图例信息
      legend: {
        title: "",
        fields: [],
        style: {
          containerStyle: {},
          titleStyle: {},
          rowStyle: {},
          symbolStyle: {},
          labelStyle: {},
          bottomStyle: {}
        },
        class: {
          containerClass: {},
          titleClass: {},
          rowClass: {},
          symbolClass: {},
          labelClass: {},
          bottomClass: {}
        }
      },
      legendColors: undefined,
      isSvg: false
    }
  },
  created() {
    this.panelType = "custom";
  },
  mounted() {
    this.mount();
  },
  methods: {
    legendClick(e) {
      let index = Number(e.target.dataset.index);
      let clickLegendData = this.symbolList[index];
      this.$emit("legendClick", clickLegendData);
    },
    mount() {
      // 如果传入renderInfo直接生成最终图例信息，未传入则通过专题图renderer生成
      if (this.rendererInfo && this.rendererInfo.fields) {
        this.isSvg = this.rendererInfo.fields[0].source ? true : false
        this.legend = Object.assign(this.legend, this.rendererInfo);
      } else {
        this.rendererInfoCopy = this.$_getRendererInfo();
        this.isSvg = this.rendererInfoCopy.fields[0].source ? true : false
        this.legend = Object.assign(this.legend, this.rendererInfoCopy);
      }
    },
    $_getRendererInfo() {
      let {renderer, rendererInfoCopy} = this;
      let {type, legendOptions, visualVariables} = renderer;
      if (!legendOptions) {
        legendOptions = {thtle: "title"};
      }
      let fields = [];
      // 如果renderer中包含visualVariables，则优先按照visualVariables绘制，图例项在visualVariables中构造
      if (visualVariables) {
        let {symbol, label, defaultSymbol, defaultLabel} = renderer;
        symbol = symbol ? symbol : defaultSymbol;
        label = label ? label : defaultLabel;
        fields = visualVariables[0].stops.map(item => {
          let itemResult = {
            label: item.label,
            color: item.color
          }
          return itemResult;
        });
        fields.push({label: label, color: symbol.symbolLayers.material.color});
        rendererInfoCopy = {
          title: legendOptions.title,
          fields
        }
        return rendererInfoCopy;
      }
      // 根据统一、单值、分段专题图构造图例项
      switch (type) {
        case "simple": {
          let {symbol, label} = renderer;
          let {material, resource} = symbol.symbolLayers;
          fields.push({label, color: material.color, source: resource ? resource.herf : undefined});
          rendererInfoCopy = {
            title: legendOptions.title,
            fields
          }
          return rendererInfoCopy;
        }
        case "unique-value": {
          let rendererInfoCopy = this.$_generateInfo(legendOptions, renderer.uniqueValueInfos);
          return rendererInfoCopy;
        }
        case "class-breaks": {
          let rendererInfoCopy = this.$_generateInfo(legendOptions, renderer.classBreakInfos);
          return rendererInfoCopy;
        }
      }
    },
    $_generateInfo(legendOptions, info) {
      let {defaultSymbol, defaultLabel, classBreakInfos} = this.renderer;
      let {material, resource} = defaultSymbol.symbolLayers;
      let fields = info.map(item => {
        let itemResource = item.symbol.symbolLayers.resource;
        let itemResult = {
          label: item.label,
          color: item.symbol.symbolLayers.material.color,
          source: itemResource ? itemResource.herf : undefined
        }
        return itemResult;
      })
      fields.push({label: defaultLabel, color: material.color, source: resource ? resource.herf : undefined});
      let resultInfo = {
        title: legendOptions.title || "title",
        fields
      };
      return resultInfo;
    },
    $_highlightChanged(id) {
      this.$emit("highlightChanged", id);
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
.mapgis-theme-legend-3d {
  min-width: 250px;
  border: 2px solid grey;
  border-radius: 4px;
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1;
  color: rgb(57, 57, 57);
  background-color: #fff;
}

.mapgis-theme-legend-title-3d {
  font-size: 20px;
  font-weight: bold;
  margin: 5px 8px;
  text-align: center;
}

.mapgis-theme-legend-row-3d {
  margin-top: 12px;
  height: 40px;
}

.mapgis-theme-legend-color-3d {
  width: 39%;
  height: 40px;
  float: left;
  margin-left: 27px;
}

.mapgis-theme-legend-svg-3d {
  width: 39%;
  height: 40px;
  float: left;
  position: relative;
}

.mapgis-theme-legend-svg-3d img {
  width: 25px;
  height: 25px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
}

.mapgis-theme-legend-content-3d {
  width: 50%;
  height: 40px;
  float: left;
  font-size: 20px;
  font-weight: bold;
  padding-top: 5px;
  text-align: center;
}

.mapgis-theme-legend-bottom-3d {
  margin-top: 12px;
}
</style>