import { TileLayer } from "leaflet";
import RasterlayerMixin from "./RasterlayerMixin";
import RasterLayerEvents from "./RasterLayerEvents";

export default {
  name: "mapgis-rastertile-layer",
  mixins: [RasterlayerMixin],

  props: {
    layerStyle: {
      type: Object,
      default: () => {
        return {
          visible: true,
          opacity: 1.0,
          zIndex: 1,
        };
      },
    },
  },

  data() {
    return {
      url: "",
    };
  },

  created() {
    this.$_deferredMount();

    if (this.url) {
      this.$watch("url", function (next) {
        if (this.initial) return;
        this.$_deferredUnMount();
        this.$_deferredMount();
      });
    }
  },

  methods: {
    $_init() {
      this.url = this.baseUrl;
    },
    $_deferredMount() {
      this.$_init();
      this.$_addLayer();
      this.$_bindLayerEvents(RasterLayerEvents);

      this.initial = false;
    },

    $_addLayer() {
      const { url, layerStyle, _props, map } = this;
      const { opacity = 1, zIndex = 1 } = layerStyle;

      let props = {
        ..._props,
        zIndex,
        opacity,
      };

      let layer = new TileLayer(url, props);
      layer.addTo(map);
      this.$_emitEvent("added", { layer: this.layer });
    },
    $_deferredUnMount() {
      this.layer.remove();
      this.initial = true;
    },
  },
};
