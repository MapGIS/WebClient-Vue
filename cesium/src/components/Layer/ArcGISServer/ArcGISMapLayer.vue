<script src="../../Base/Vue/VueOptions.js"></script>
<template>
  <span></span>
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-arcgis-map-layer",
  props: {
    url: {
      type: String,
      required: true
    },
    srs: {
      type: String,
      defalut:"EPSG:4326"
    },
    layers: {
      type: String
    },
    id: {
      type: String,
      default: ""
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
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        rectangle: "object",
        tilingScheme: "object",
        ellipsoid: "object",
        tileWidth: "number",
        tileHeight: "number",
        maximumLevel: "number",
        credit: "object|String",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      //layerStyle的副本，供watch使用
      layerStyleCopy: {},
      initial: true,
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
    srs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layers: {
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
        let baseUrl = this.url;
        const url = baseUrl + "/export?";
        return url;
      }
    },
    createCesiumObject() {
      const url = this.initUrl();
      let {options, layers, Cesium} = this;
      options = this.$_initOptions(options);
      if (layers) {
        if (layers.indexOf("show") >= 0 ) {
          layers = this.layers.replace("show:", "");
        }
      }
      const allOptions = {...options, layers, url};
      return new Cesium.ArcGisMapServerImageryProvider(allOptions);
    },
    mount() {
      //检测参数类型是否正确，不正确不会往下执行
      this.$_check();
      let provider = this.createCesiumObject();
      let {webGlobe, layerStyle} = this;
      this.layerStyleCopy = Object.assign({}, layerStyle);
      const {zIndex, visible, opacity} = layerStyle;
      const {vueIndex, vueKey, CesiumZondy} = this;
      layerStyle = this.$_initLayerStyle(layerStyle);

      const viewer = webGlobe.viewer;
      let imageLayer = viewer.imageryLayers.addImageryProvider(provider, zIndex);

      CesiumZondy.arcgisManager.addSource(vueKey, vueIndex, imageLayer, {zIndex: zIndex});
      // let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
      if (imageLayer && this.initial) {
        if (typeof visible == "boolean") {
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
          !viewer.isDestroyed()
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
    $_initOptions(options) {
      //切片规则：
      if (this.srs) {
        options.tilingScheme = this.srs
        if (
            options.tilingScheme === "EPSG:4326" ||
            options.tilingScheme === "EPSG:4490" ||
            options.tilingScheme === "EPSG:4610" ||
            options.tilingScheme === "EPSG:4214"
        ) {
          options.tilingScheme = new Cesium.GeographicTilingScheme();
        } else if (options.tilingScheme === "EPSG:3857") {
          options.tilingScheme = new Cesium.WebMercatorTilingScheme();
        } else if (this.options.tilingScheme) {
          options.tilingScheme = options.tilingScheme;
        } else {
          options.tilingScheme = new Cesium.GeographicTilingScheme();
        }
      }
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
      return options;
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