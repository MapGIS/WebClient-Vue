<template>
  <span/>
</template>
<script>
import clonedeep from "lodash.clonedeep";

export default {
  name: "mapgis-3d-igs-feature-layer",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    mapIndex: {
      type: Number
    },
    layers: {
      type: String,
      default: null
    },
    autoReset: {
      type: Boolean,
      default: true
    },
    loadAll: {
      type: Boolean,
      default: false
    },
    setViewToExisting: {
      type: Boolean,
      default: false
    },
    filter: {
      type: [Object, Array],
      default: null
    },
    clampToGround: {
      type: Boolean,
      default: false
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    featureStyle: {
      type: [Object, Array]
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    baseUrl: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
    filter: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
    featureStyle: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    }
  },
  methods: {
    mount() {
      let {webGlobe, CesiumZondy} = this;
      let vm = this;
      let featureLayers;
      let options = {};
      options = vm.initOptions(options);
      featureLayers = webGlobe.appendMapGISVectorDocMap(vm.baseUrl, options);
      CesiumZondy.IgsFeatureManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          featureLayers
      );
      //抛出load事件
      this.$emit("load", {featureLayers:featureLayers});
    },
    unmount() {
      //图层移除
      let {webGlobe} = this;
      const {vueKey, vueIndex} = this;
      let find = CesiumZondy.IgsFeatureManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        let findSource = find.source;
        webGlobe.removeMapGISVectorLayer(findSource);
      }
      CesiumZondy.IgsFeatureManager.deleteSource(vueKey, vueIndex);
    },
    initOptions(options) {
      const vm = this;
      let {layers, autoReset, filter, mapIndex, featureStyle, clampToGround, loadAll, setViewToExisting} = this;
      if (layers) {
        if (layers.indexOf("gdbp") <= -1 && layers.indexOf("layers") <= -1) {
          layers = 'layers=show:' + layers;
        }
        options.layers = layers;
      }
      if (autoReset) {
        options.autoReset = autoReset;
      }
      if (filter) {
        options.filter = filter;
      }
      if (featureStyle) {
        let featureStyleCopy = clonedeep(featureStyle);
        if (Array.isArray(featureStyle)) {
          // 先做key值替换
          let tempArr = [];
          featureStyleCopy.map((currentVal, index, array) => {
            tempArr.push({
              'type':currentVal.type,'styleOptions':currentVal.parameters
            })
          })
          tempArr.forEach((fs) => {
            let styleOptions = fs.styleOptions;
            if (styleOptions && styleOptions.color) {
              let colorTrans = vm.colorToCesiumColor(styleOptions.color);
              styleOptions.color = colorTrans;
            }
            if (styleOptions && styleOptions.outlineColor) {
              let outlineColorTemp = vm.colorToCesiumColor(styleOptions.outlineColor);
              styleOptions.outlineColor = outlineColorTemp;
            }
            fs.styleOptions = styleOptions;
          })
          options.style = tempArr;
        } else {
          // 先做key值替换
          featureStyleCopy = this.$_changeKey(featureStyleCopy);
          let styleOptions = featureStyleCopy.styleOptions;
          if (styleOptions && styleOptions.color) {
            styleOptions.color = vm.colorToCesiumColor(styleOptions.color);
          }
          if (styleOptions && styleOptions.outlineColor) {
            let outlineColorTemp = vm.colorToCesiumColor(styleOptions.outlineColor);
            styleOptions.outlineColor = outlineColorTemp;
          }
          options.style = featureStyleCopy;
        }
      }
      if (mapIndex) {
        options.mapIndex = mapIndex;
      }
      if (clampToGround) {
        options.clampToGround = true;
      }
      if (loadAll) {
        options.loadAll = loadAll;
      }
      if (setViewToExisting) {
        options.setViewToExisting = setViewToExisting;
      }
      options.pageCount = 0
      return options;
    },
    /**
     * rgba或者十六进制转换成cesium.color
     * @param color
     * @returns {*}
     */
    colorToCesiumColor(color) {
      let cesiumColor;
      if (color.includes('rgb')) {
        // 如果是rgb或者rgba
        const a = color.split('(')[1].split(')')[0];
        const arr = a.split(',');
        const cesiumRed = Number((Number(arr[0]) / 255).toFixed(2));
        const cesiumGreen = Number((Number(arr[1]) / 255).toFixed(2));
        const cesiumBlue = Number((Number(arr[2]) / 255).toFixed(2));
        const cesiumAlpha = Number(arr[3] ? arr[3] : 1);
        cesiumColor = this.webGlobe.getColor(
            cesiumRed,
            cesiumGreen,
            cesiumBlue,
            cesiumAlpha
        )
      } else if (color.indexOf('#') >= 0) {
        cesiumColor = Cesium.Color.fromCssColorString(color);
      }
      return cesiumColor;
    },
    //该方法用于修改对象的key值
    $_changeKey(oldFeatureStyle) {
      let keyMap = {type: "type", parameters: "styleOptions"};
      let newFeatureStyle = Object.keys(oldFeatureStyle).reduce((newData, key) => {
        let newKey = keyMap[key] || key;
        newData[newKey] = oldFeatureStyle[key];
        return newData;
      }, {});
      return newFeatureStyle;
    }
  }
}
</script>

<style scoped>

</style>