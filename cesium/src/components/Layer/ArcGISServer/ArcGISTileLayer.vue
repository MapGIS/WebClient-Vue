<script>
import VueOption from "../../Base/Vue/VueOptions";
import RasterLayer from "../RasterLayer";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    url: {
      type: String,
      default: null
    },
    srs: {
      type: String,
      default: "EPSG:4326"
    },
    layers: {
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
    ...VueOption,
  },
  data(){
    return {

    }
  },
  inject: ["Cesium", "webGlobe"],
  mixins: [RasterLayer],
  created() {
  },
  mounted() {
    this.layerStyleCopy = Object.assign({}, this.layerStyle);
    this.mount();
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
        let {vueKey, vueIndex} = this;
        let layer = window.CesiumZondy.arcgisManager.findSource(vueKey, vueIndex);
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
      let {options, layerStyle, layers, Cesium} = this;
      options = this.$_initOptions(options);
      layerStyle = this.$_initLayerStyle(layerStyle);
      const allOptions = {...options, ...layerStyle, layers, url};
      const provider = new Cesium.ArcGisMapServerImageryProvider(allOptions);
      return new Cesium.ImageryLayer(provider || {});
    },
    mount() {
      this.createCesiumObject();
      const {webGlobe, imageryLayer, layerStyle} = this;
      const {vueIndex, vueKey} = this;
      window.CesiumZondy.arcgisManager.addSource(vueKey, vueIndex, imageryLayer);
      const viewer = webGlobe.viewer;
      const zIndex = layerStyle.zIndex;
      viewer.imageryLayers.add(imageryLayer, zIndex);
      return (
          !viewer.isDestroyed() && viewer.imageryLayers.contains(imageryLayer)
      );
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