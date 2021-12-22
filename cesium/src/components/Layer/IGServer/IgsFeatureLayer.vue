<template>
  <span/>
</template>
<script>
import clonedeep from "lodash.clonedeep";

export default {
  name: "mapgis-3d-igs-feature-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    baseUrl: {
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
      type: Object,
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
      type: Object,
      default(){
        return {}
      }
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
      let {viewer, vueCesium} = this;
      let vm = this;
      let layerIndex;
      let options = {};
      options = vm.initOptions(options);
      // if (vm.baseUrl.indexOf("/g3d") > -1) {
      //   layerIndex = viewer.scene.layers.appendG3DLayer(vm.baseUrl, {
      //     ...options,
      //     getDocLayerIndexes: vm._handleCallback
      //   });
      // } else {
        layerIndex = viewer.scene.layers.appendVectorLayer(vm.baseUrl, {
          ...options,
          getDocLayerIndexes: vm._handleCallback
        });
      // }

      vueCesium.IgsFeatureManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          layerIndex
      );
    },
    unmount() {
      //图层移除
      let {viewer, vueCesium} = this;
      const {vueKey, vueIndex} = this;
      let find = vueCesium.IgsFeatureManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        let findSource = find.source;
        viewer.scene.layers.removeImageryLayerByID(findSource);
      }
      vueCesium.IgsFeatureManager.deleteSource(vueKey, vueIndex);
    },
    initOptions(options) {
      const {Cesium} = this;
      let {autoReset, filter, mapIndex, featureStyle, clampToGround, loadAll, setViewToExisting} = this;
      if (autoReset) {
        options.autoReset = autoReset;
      }
      if (filter) {
        options.filter = filter;
      }
      if (featureStyle) {
        let featureStyleCopy = clonedeep(featureStyle);
        // if (Array.isArray(featureStyle)) {
        //   // 先做key值替换
        //   let tempArr = [];
        //   featureStyleCopy.map((currentVal, index, array) => {
        //     tempArr.push({
        //       'type': currentVal.type, 'styleOptions': currentVal.parameters
        //     })
        //   })
        //   tempArr.forEach((fs) => {
        //     let styleOptions = fs.styleOptions;
        //     if (styleOptions && styleOptions.color) {
        //       let colorTrans = Cesium.Color.fromCssColorString(styleOptions.color);
        //       styleOptions.color = colorTrans;
        //     }
        //     if (styleOptions && styleOptions.outlineColor) {
        //       let outlineColorTemp = Cesium.Color.fromCssColorString(styleOptions.outlineColor);
        //       styleOptions.outlineColor = outlineColorTemp;
        //     }
        //     fs.styleOptions = styleOptions;
        //   })
        //   options.style = tempArr;
        // } else {
          // 先做key值替换
          featureStyleCopy = this.$_changeKey(featureStyleCopy);
          let styleOptions = featureStyleCopy.styleOptions;
          if (styleOptions && styleOptions.color) {
            styleOptions.color = Cesium.Color.fromCssColorString(styleOptions.color);
          }
          if (styleOptions && styleOptions.outlineColor) {
            let outlineColorTemp = Cesium.Color.fromCssColorString(styleOptions.outlineColor);
            styleOptions.outlineColor = outlineColorTemp;
          }
          options.style = featureStyleCopy;
        // }
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

    //该方法用于修改对象的key值
    $_changeKey(oldFeatureStyle) {
      let keyMap = {type: "type", parameters: "styleOptions"};
      let newFeatureStyle = Object.keys(oldFeatureStyle).reduce((newData, key) => {
        let newKey = keyMap[key] || key;
        newData[newKey] = oldFeatureStyle[key];
        return newData;
      }, {});
      return newFeatureStyle;
    },

    _handleCallback(indexs) {
      let layerIndex = indexs;
      //抛出load事件
      this.$emit("loaded", {layerIndex: layerIndex});
    }
  }
}
</script>

<style scoped>

</style>