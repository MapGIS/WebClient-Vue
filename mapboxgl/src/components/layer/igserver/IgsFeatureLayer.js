import layerMixin from "../layerMixin";
import layerEvents from "../../../lib/layerEvents";
import clonedeep from "lodash.clonedeep";

import { IGSFeatureLayer } from "@mapgis/webclient-common";
import { MRFS } from "@mapgis/webclient-es6-service";
const { QueryDocFeature, QueryLayerFeature } = MRFS;

export default {
  name: "mapgis-igs-feature-layer",
  mixins: [layerMixin],
  props: {
    baseUrl: {
      type: String,
      default: null,
    },
    mapIndex: {
      type: Number,
      default: 0,
    },
    layers: {
      type: [String, Array],
      default: null,
    },
    tileFeaturesCount: {
      type: Number,
      default: 400,
    },
    filter: {
      type: String,
      default: null,
    },
    layerStyle: {
      type: Object,
      default: null,
    },
    guid: {
      type: String,
      default: new Date().getTime().toString(),
    },
    gdbps: {
      type: [String, Array],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    renderMode: {
      type: String,
      default: "client",
    },
    token: {
      type: Object,
      default: () => {},
    },
    commonLayer: {
      type: Object,
    },
  },
  render(h) {
    if (!this.showLayer) {
      return h();
    }
    return h("div", [
      h("mapgis-geojson-layer", {
        ref: "geojsonLayer",
        props: {
          layerId: this.layerId,
          sourceId: this.sourceId,
          visible: this.visible,
          data: this.geojsonData,
          layerStyle: this.layerStyle.featureStyle,
          enablePopup: this.enablePopup,
          popupOptions: this.popupOptions,
          enableTips: this.enableTips,
          tipsOptions: this.tipsOptions,
          highlightStyle: this.layerStyle.highlightStyle,
          customPopup: this.customPopup,
          customTips: this.customTips,
        },
      }),
    ]);
  },
  data() {
    return {
      geojsonData: null,
      showLayer: false,
    };
  },
  watch: {
    baseUrl(val) {
      this.showLayer = false;
      this.$nextTick(() => {
        this.mount();
      });
    },
    gdbps(val) {
      this.showLayer = false;
      this.$nextTick(() => {
        this.mount();
      });
    },
  },
  mounted() {
    this.mount();
  },
  methods: {
    async mount() {
      if (this.commonLayer) {
        this.igsFeatureLayer = this.commonLayer.clone();
      } else {
        const { baseUrl, gdbps, token, renderMode } = this;
        if (baseUrl && gdbps) {
          const options = {
            url: baseUrl,
            gdbp: gdbps,
            renderMode,
          };
          if (token.tokenKey && token.tokenValue) {
            options.tokenKey = token.tokenKey;
            options.tokenValue = token.tokenValue;
          }
          this.igsFeatureLayer = new IGSFeatureLayer(options);
        }
      }
      try {
        if (!this.igsFeatureLayer.loaded) {
          await this.igsFeatureLayer.load();
        }
        const jsonData = await this.igsFeatureLayer.queryFeatures({
          resultRecordCount: 100000,
        });
        this.geojsonData = jsonData.toGeoJSON();
        this.showLayer = true;
      } catch (error) {
        this.geojsonData = null;
        this.showLayer = false;
      }
    },
  },
  beforeDestroy() {
    this.showLayer = false;
  },
};
