import rasterLayer from "../RasterLayer";
import layerEvents from "../../../lib/layerEvents";
import mapboxgl from "@mapgis/mapbox-gl";
export default {
  name: "mapgis-supermap-raster-layer",
  mixins: [rasterLayer],
  inject: ["mapbox"],
  props: {
    baseUrl: {
      type: String,
      default: "",
    },
    layerType: {
      type: String,
      default: null,
    },
    layerId: {
      type: String,
      default: null,
    },
    tileSize: {
      type: Number,
      default: 256,
    },
    transparent: {
      type: Boolean,
      default: true,
    },
    redirect: {
      type: Boolean,
      default: false,
    },
    cacheEnabled: {
      type: Boolean,
      default: true,
    },
    originx: {
      type: Number,
      default: -180,
    },
    originy: {
      type: Number,
      default: 90,
    },
    level: {
      type: Array,
      default: function () {
        return [];
      },
    },
    scale: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      rasterUrl: "",
    };
  },
  mounted() {},
  methods: {
    $_init() {
      const {
        baseUrl,
        tileSize,
        transparent,
        redirect,
        cacheEnabled,
        originx,
        originy,
      } = this;
      if (this.baseUrl) {
        let url = `origin={"x":${originx},"y":${originy}}`;
        let encode = encodeURIComponent(url);
        this.rasterUrl = `${baseUrl}/tileimage.png?scale={z}&x={x}&y={y}&width=${tileSize}&height=${tileSize}&transparent=${transparent}&redirect=${redirect}&cacheEnabled=${cacheEnabled}&${encode}`;
      }
    },
    $_transformScale(value) {
      let transformResult;
      let { level, scale } = this;
      if (level.length <= 0 || scale.length <= 0) return;
      for (let i = 0; i < level.length; i++) {
        if (level[i] == value) transformResult = scale[i];
      }
      return transformResult;
    },

    $_deferredMount() {
      const vm = this;
      this.$_init();
      mapboxgl.CanonicalTileID.prototype.replaceRule = function (
        replace,
        value
      ) {
        const { type, fixlength, prefix, postfix } = replace;
        let str = value;
        let fix = 0;
        switch (type) {
          case "hex":
            str = value.toString(16).toUpperCase();
            break;
          case "dec":
            str = value.toString(10).toUpperCase();
            break;
          case "oct":
            str = value.toString(8).toUpperCase();
            break;
          case "bin":
            str = value.toString(2).toUpperCase();
            break;
          case "replace":
            str = vm.$_transformScale(value);
            break;
        }
        if (fixlength) {
          str = vm.format(str, fixlength);
        }

        if (prefix) {
          str = prefix + str;
        }
        if (postfix) {
          str = str + postfix;
        }
        return str;
      };
      let source = {
        type: "raster",
        tiles: [this.rasterUrl],
        tileSize: this.tileSize,
        mapgisOffset: -1,
        tileUrlReplace: [
          {
            type: "default",
          },
          {
            type: "default",
          },
          {
            type: "replace",
          },
        ],
        ...this.source,
      };

      this.map.on("dataloading", this.$_watchSourceLoading);
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        }
      }
      this.$_addLayer();
      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;
    },
  },
};
