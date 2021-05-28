<template>
  <span/>
</template>
<script>
import VueOption from "../../Base/Vue/VueOptions";
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    url: {
      type: String,
      required:true
    },
    id: {
      type: String
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    layerStyle: {
      type: Object,
      default: function () {
        return {
          visible: true,
          opacity: 1
        }
      }
    },
  },
  data() {
    return {
      initial: true,
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number",
      },
    }
  },
  inject: ["Cesium", "webGlobe", "CesiumZondy"],
  mixins: [ServiceLayer],
  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    url: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layerStyle: {
      handler: function () {
        let {vueKey, vueIndex, CesiumZondy} = this;
        let layer = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
        if (this.layerStyleCopy.visible !== this.layerStyle.visible) {
          layer.source.show = this.layerStyle.visible;
        }
        if (this.layerStyleCopy.opacity !== this.layerStyle.opacity) {
          layer.source.alpha = this.layerStyle.opacity;
        }
        if (this.layerStyleCopy.zIndex !== this.layerStyle.zIndex) {
          this.$_moveLayer();
        }
        this.layerStyleCopy = Object.assign(this.layerStyleCopy, this.layerStyle);
      },
      deep: true
    },
    options: {
      handler: function () {
        this.unmount();
        this.mount();
      },
      deep: true
    },
    id: {
      handler: function (next) {
        const {vueIndex, vueKey, CesiumZondy} = this;
        let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
        find.source.id = next;
      }
    }
  },
  methods: {
    initUrl() {
      if (this.url) {
        return this.url;
      }
    },
    createCesiumObject() {
      const url = this.initUrl();
      let {options, layers, Cesium} = this;

      //vueKey为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueKey = this.$_checkValue(options, "vueKey", "");
      if (checkVueKey === "null") {
        this.vueKey = "default";
      }

      //vueIndex为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueIndex = this.$_checkValue(options, "vueIndex", "");
      if (checkVueIndex === "null") {
        this.vueIndex = (Math.random() * 100000000).toFixed(0);
      }
      const allOptions = {...options, layers, url};
      return new Cesium.ArcGisMapServerImageryProvider(allOptions);
    },
    mount() {
      //检测参数类型是否正确，不正确不会往下执行
      this.$_check();
      let provider = this.createCesiumObject();
      this.layerStyleCopy = Object.assign({}, this.layerStyle);
      let {webGlobe, layerStyle} = this;
      const {vueIndex, vueKey, CesiumZondy} = this;
      const {zIndex, visible, opacity} = layerStyle;
      layerStyle = this.$_initLayerStyle(layerStyle);
      const viewer = webGlobe.viewer;
      const {imageryLayers} = viewer;
      let imageLayer = imageryLayers.addImageryProvider(provider, zIndex);

      CesiumZondy.arcgisManager.addSource(vueKey, vueIndex, imageLayer, {zIndex: zIndex});
      // let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
      if (imageLayer && this.initial) {
        if (visible) {
          imageLayer.show = visible;
        }
        if (opacity >= 0) {
          imageLayer.alpha = opacity;
        }
        if (this.id) {
          imageLayer.id = this.id;
        } else {
          imageLayer.id = vueIndex;
        }
      }
      if (this.initial) {
        this.$_initLayerIndex();
      }
      this.initial = false;
      this.$emit("load", imageLayer, this);
      return (
          !viewer.isDestroyed() // && viewer.imageryLayers.contains(imageLayer)
      );
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex, CesiumZondy} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      CesiumZondy.arcgisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },

    $_initLayerStyle(layerStyle) {
      if (layerStyle.zIndex == null && layerStyle.zIndex === undefined) {
        layerStyle.zIndex = this.vueIndex;
      }
      return layerStyle;
    }
  }
}
</script>

<style scoped>

</style>