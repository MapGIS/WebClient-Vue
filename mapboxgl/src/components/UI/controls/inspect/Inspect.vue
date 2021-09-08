<template>
  <div class="mapgis-inspect-content">
    <Popup
      :mode="clickMode"
      :currentLayerInfo="currentLayerInfo"
      @select-layer="changePane"
    />
  </div>
</template>

<script>
// 此处的typescript 会和 require("mapbox-gl-inspect"); module.export 冲突
// @see https://github.com/webpack/webpack/issues/4039
// import { IDocument, VectorTile } from "@mapgis/webclient-store";
// const { Convert } = VectorTile;

import mapboxgl from "@mapgis/mapbox-gl";
import cloneDeep from "lodash.clonedeep";
const MapboxInspect = require("mapbox-gl-inspect");
import Popup from "../../../layer/geojson/Popup";

export default {
  name: "mapgis-inspect",
  inject: ["map", "mapbox"],
  components: {
    Popup
  },
  mounted() {
    this.enableInspect();
  },
  props: {
    mode: {
      type: String,
      default: "none" // none, single
    },
    document: {
      type: Object
    },
    title: {
      type: String
    },
    fields: {
      type: Array
    }
  },
  watch: {
    mode: function(newMode) {
      let oldMode = this.oldMode;
      if (oldMode == undefined && newMode == "single") {
        this.recordStyle();
        this.inspectStyle();
      } else if (oldMode == undefined && newMode == "none") {
        this.recordStyle();
        this.renderStyle();
      } else if (oldMode == "single" && newMode == "none") {
        this.restoreStyle();
        this.inspectStyle();
      } else {
        this.inspectStyle();
      }
      if (oldMode != newMode) {
        this.oldMode = newMode;
      }
    },
    document: {
      handler(next) {
        let { mode, oldId } = this;
        let newId = next.current.id;
        if (oldId != newId) {
          if (mode == "none") {
            this.restoreStyle();
            // this.renderStyle();
          } else if (mode == "single") {
            this.renderStyle();
          }
          this.oldId = newId;
        }
      },
      deep: true
    }
  },
  data() {
    return {
      clickMode: "click",
      currentLayerInfo: [],
      tabPosition: "left",
      activeKey: "",
      oldMode: undefined,
      oldId: undefined,
      oldStyle: undefined
    };
  },
  beforeDestroy() {
    const { inspect, map } = this;
    if (inspect && map) {
      map.removeControl(inspect);
    }
  },
  methods: {
    enableInspect() {
      const vm = this;
      const { map, title, fields } = this;

      if (!map || !map.getStyle()) {
        return;
      }

      const inspect = new MapboxInspect({
        popup: new mapboxgl.Popup({
          closeOnClick: true,
          closeButton: true
        }),
        // showInspectMap: true,
        showMapPopup: true,
        showMapPopupOnHover: false,
        showInspectMapPopupOnHover: false,
        showInspectButton: false,
        blockHoverPopupOnClick: false,
        buildInspectStyle: (originalMapStyle, coloredLayers) =>
          vm.buildInspectStyle(originalMapStyle, coloredLayers, "", vm),
        renderPopup: features => {
          let fs = cloneDeep(features);
          let newfeatrues = fs.map(f => {
            let properties = f.properties;

            if (fields) {
              f.properties = {};
              fields.forEach(field => {
                f.properties[field] = properties[field];
              });
            }

            if (title) {
              f.title = properties[title];
            }

            return f;
          });
          
          vm.currentLayerInfo = newfeatrues;
          return vm.$el;
        }
      });
      map.addControl(inspect);
      this.inspect = inspect;
    },
    changePane(key) {
      let vm = this;
      let checkedLayer;
      for (let i = 0; i < vm.currentLayerInfo.length; i++) {
        if (key === i) {
          checkedLayer = vm.currentLayerInfo[i];
        }
      }
      this.$emit("select-layer", checkedLayer);
    },
    buildInspectStyle(originalMapStyle, coloredLayers, current, self) {
      const backgroundLayer = {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#3b3b3b"
        }
      };

      if (!self || !self.map || !self.document) return self.map.getStyle();

      let doc = IDocument.deepclone(self.document);
      let conv = new Convert();
      coloredLayers = conv.convertInspectMode(doc);

      const sources = {};
      Object.keys(originalMapStyle.sources).forEach(sourceId => {
        const source = originalMapStyle.sources[sourceId];
        if (source.type !== "raster" && source.type !== "raster-dem") {
          sources[sourceId] = source;
        }
      });

      const inspectStyle = {
        ...originalMapStyle,
        sources: sources,
        layers: [backgroundLayer].concat(coloredLayers)
      };
      console.log('inspectStyle', inspectStyle);
      return inspectStyle;
    },
    recordStyle() {
      const { map } = this;
      this.oldStyle = cloneDeep(map.getStyle());
    },
    restoreStyle() {
      const { inspect, oldStyle } = this;
      if (!inspect || !oldStyle) return;
      inspect.originalStyle = oldStyle;
      inspect.render();
    },
    renderStyle() {
      let { inspect, map, mode } = this;
      if (!inspect || !map) return;
      inspect.render();
    },
    inspectStyle() {
      let { inspect, map, mode } = this;
      if (!inspect || !map) return;
      inspect.toggleInspector();
    }
  }
};
</script>
