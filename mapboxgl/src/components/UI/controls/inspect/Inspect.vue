<template>
  <div class="mapgis-inspect-content">
    <slot :currentLayerInfo="currentLayerInfo" name="content">
      <div class="mapgis-inspect-prop-tabs">
        <mapgis-ui-tabs
          v-model="activeKey"
          :style="{ height: '240px' }"
          size="small"
          :active-key="activeKey"
          :tab-position="mode"
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
import mapboxgl from "@mapgis/mapbox-gl";
const MapboxInspect = require("mapbox-gl-inspect");

export default {
  name: "mapgis-inspect",
  inject: ["map", "mapbox"],
  mounted() {
    this.enableInspect();
  },
  data() {
    return {
      currentLayerInfo: [],
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      checkedInfo: "",
      check: false,
      selectdType: [],
      mode: "left",
      activeKey: ""
    };
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
          closeOnClick: false,
          closeButton: false
        }),
        // showInspectMap: true,
        showMapPopup: true,
        showMapPopupOnHover: false,
        showInspectMapPopupOnHover: true,
        showInspectButton: false,
        blockHoverPopupOnClick: false,
        // buildInspectStyle: (originalMapStyle, coloredLayers) => self.buildInspectStyle(
        //     originalMapStyle, coloredLayers, self.props.current, self),
        renderPopup: features => {
          vm.currentLayerInfo = features;
          return vm.$el;
        }
      });
      map.addControl(inspect);
    },
    changePane(key) {
      let vm = this;
      let checkedLayer;
      for (let i = 0; i < vm.currentLayerInfo.length; i++) {
        if (key === i) {
          checkedLayer = vm.currentLayerInfo[i];
        }
      }
      vm.$emit("select-layer", checkedLayer);
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
  width: 100%;
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
