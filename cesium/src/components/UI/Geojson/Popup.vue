<template>
  <div class="mapgis-featuretool-content" ref="geojsontool">
    <div class="mapgis-inspect-prop-tabs">
      <mapgis-ui-tabs
        v-if="mode === 'click'"
        v-model="activeKey"
        :style="{ height: '240px' }"
        size="small"
        :tab-position="tabPosition"
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
          <div class="mapgis-popup-content-title">
            {{ f.title }}
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
      <div v-else>
        <div v-if="currentLayerInfo && currentLayerInfo.length > 0">
          <div>
            {{ currentLayerInfo[0].title }}
          </div>
          <div
            v-for="(value, key) in currentLayerInfo[0].properties"
            class="mapgis-inspect-prop-style"
            :key="key"
          >
            <div class="mapgis-inspect-prop-key">
              <span style="padding-right: 5px">{{ key }}</span>
            </div>
            <div>{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "mapgis-3d-geojson-popup",
  inject: ["Cesium", "CesiumZondy"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return { height: "120px", width: "240px" };
      }
    },
    mode: {
      type: String,
      default: "click"
    },
    currentLayerInfo: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    activeKey(next) {
      this.$emit("select-layer", next);
    },
    currentLayerInfo() {
      this.activeKey = 0;
    }
  },
  data() {
    return {
      tabPosition: "top",
      activeKey: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.activeKey) {
        this.$emit("select-layer", this.activeKey);
      }
    });
  }
};
</script>
