<template>
  <div class="mapgis-geojsontool-content" ref="geojsontool">
    <div class="mapgis-inspect-prop-tabs">
      <mapgis-ui-tabs
          v-if="mode === 'click'"
          v-model="activeKey"
          :style="{ height: '240px' }"
          size="small"
          :active-key="activeKey"
          :tab-position="tabPosition">
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
          <div>
            {{f.title}}
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
          <br/>
        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
      <div v-else>
        <div>
          {{f.title}}
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "mapgis-geojson-popup",
  inject: ["map", "mapbox"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
       return { height: '120px', width: '240px'}
      }
    },
    mode: {
      type: String,
      default: 'click'
    },
      currentToolInfo: {
        type: String,
        default : "",
      },
      userProsChecked:  {
        type: Array,
        default : () => []
      },
      inspectActive: {
        type: Boolean,
        default: false
      },
      currentNum: {
        type: String,
        default: ''
      },
      currentLayerInfo: {
        type: Array,
        default : () => []
      },
      popupTitle:  {
        type: String,
        default: 'id'
      },
      hoveredStateId: {
        type: Number,
        default: -1
      },
  },
  data() {
    return {
      tabPosition: "top",
      activeKey: "",
    }
  }
}
</script>

<style>
.mapgis-geojsontool-content {
  position: absolute;
  z-index: 1000;
}
.mapgis-inline {
  display: inline-flex;
}

.mapgis-inspect-prop-tabs {
  min-width: 320px !important;
  max-width: 320px !important;
}

/deep/ .mapboxgl-popup-content {
  height: unset !important;
  width: unset !important;
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
</style>