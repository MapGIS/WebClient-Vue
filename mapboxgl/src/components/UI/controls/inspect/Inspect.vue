<template>
  <div class="mapgis-inspect-content">
    <slot :currentLayerInfo="currentLayerInfo" name="content">
      <div class="mapgis-inspect-prop-tabs">
        <mapgis-ui-tabs
          v-model="activeKey"
          :style="{ height: '240px' }"
          size="small"
          :active-key="activeKey"
          :tab-position="tabPosition"
          @tabClick="changePane"
        >
          <mapgis-ui-tab-pane
            class="mapgis-inspect-prop-content"
            v-for="(f, i) in currentLayerInfo"
            :key="i"
          >
            <div slot="tab" class="mapgis-inspect-layer-name">
              <mapgis-ui-tooltip :title="f.layer.id">
                <span>
                  {{ f.layer.id.substr(0, 12) }}
                </span>
              </mapgis-ui-tooltip>
            </div>
            <div
              v-for="(value, key) in f.properties"
              class="mapgis-inspect-prop-style"
              :key="key"
            >
              <div class="mapgis-inspect-prop-key">
                <span style="padding-right: 5px">{{ key }}</span>
              </div>
              <div>{{ value }} ({{ typeof value }})</div>
            </div>
            <br />
          </mapgis-ui-tab-pane>
        </mapgis-ui-tabs>
      </div>
    </slot>
  </div>
</template>

<script>
import { IDocument, VectorTile } from "@mapgis/webclient-store";
import cloneDeep from "lodash.clonedeep";
import mapboxgl from "@mapgis/mapbox-gl";
const MapboxInspect = require("mapbox-gl-inspect");
const { Convert } = VectorTile;

export default {
  name: "mapgis-inspect",
  inject: ["map", "mapbox"],
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
            this.renderStyle();
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
      const { map } = this;

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
          vm.currentLayerInfo = features;
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
<style>
.mapgis-inspect-content {
  position: absolute;
  height: 240px;
}

.mapboxgl-popup-content {
  height: 260px;
  width: 360px;
}

.mapgis-inspect-prop-tabs {
  max-width: 600px !important;
  margin: 4px;
}

.mapboxgl-popup-content {
  border-radius: 10px !important;
}

.mapgis-inspect-prop-content {
  height: 240px;
  width: 220px;
  overflow-x: hidden;
  overflow-y: scroll;
  /* 针对火狐浏览器 */
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.mapgis-inspect-layer-name {
  width: 80px;
}

.mapboxgl-popup {
  width: 360px;
  /* min-width: 300px !important; */
  /* max-width: 600px !important; */
}

.mapgis-inspect-prop-style {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px dotted #bccbd7;
  padding: 5px;
}

.mapgis-inspect-prop-key {
  font-weight: 700;
  padding-right: 10px;
  display: flex;
  justify-content: flex-start;
}

.mapgis-ui-tabs .mapgis-ui-tabs-left-bar .mapgis-ui-tabs-tab,
.mapgis-ui-tabs .mapgis-ui-tabs-right-bar .mapgis-ui-tabs-tab {
  padding: 9px !important;
  margin: 0 0 10px 0 !important;
  text-align: left !important;
}
</style>
