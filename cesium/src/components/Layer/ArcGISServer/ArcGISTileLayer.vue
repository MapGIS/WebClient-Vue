<template>
  <span />
</template>
<script>
import VueOption from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    url: {
      type: String,
      default: null
    },
    srs: {
      type: String,
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
    ...VueOption,
  },
  data(){
    return {

    }
  },
  inject: ["Cesium", "webGlobe","CesiumZondy"],
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
          this.unmount();
          this.mount();
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
      options = this.$_initOptions(options);
      const allOptions = {...options, layers, url};
      return new Cesium.ArcGisMapServerImageryProvider(allOptions);
    },
    mount() {
      let provider = this.createCesiumObject();
      this.layerStyleCopy = Object.assign({}, this.layerStyle);
      let {webGlobe, layerStyle} = this;
      const {vueIndex, vueKey, CesiumZondy} = this;
      const {zIndex, visible, opacity} = layerStyle;
      layerStyle = this.$_initLayerStyle(layerStyle);
      const viewer = webGlobe.viewer;
      const {imageryLayers} = viewer;
      let imageLayer = imageryLayers.addImageryProvider(provider, zIndex);

      CesiumZondy.arcgisManager.addSource(vueKey, vueIndex, imageLayer);
      let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);

      if(find && find.source) {
        if (visible) {
          find.source.show = visible;
        }
        if (opacity >= 0) {
          find.source.alpha = opacity;
        }
      }

      return (
          !viewer.isDestroyed() // && viewer.imageryLayers.contains(imageLayer)
      );
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex,CesiumZondy} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      CesiumZondy.arcgisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },

    $_initOptions(options) {
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
      return options;
    },
    $_initLayerStyle(layerStyle){
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