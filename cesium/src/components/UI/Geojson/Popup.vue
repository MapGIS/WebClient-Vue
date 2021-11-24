<template>
  <div class="mapgis-popup-container" v-if="mode === 'click'">
    <div v-if="currentLayerInfo && currentLayerInfo.length > 0">
      <div class="mapgis-popup-title" v-if="currentLayerInfo[0].title">
        {{ currentLayerInfo[0].title}}
      </div>
      <div class="mapgis-popup-row-container">
        <div
            class="mapgis-popup-row"
            v-for="(value, key) in currentLayerInfo[0].properties"
            :key="key"
        >
          <span class="mapgis-popup-item mapgis-popup-field">{{key}}</span>
          <span class="mapgis-popup-item mapgis-popup-value">{{value}}</span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="currentLayerInfo && currentLayerInfo.length > 0">
      <div v-if="currentLayerInfo[0].title">
        {{ currentLayerInfo[0].title }}
      </div>
      <div
          v-for="(value, key) in currentLayerInfo[0].properties"
          class="mapgis-popup-row"
          :key="key"
      >
        <div class="mapgis-3d-inspect-prop-key">
          <span style="padding-right: 5px">{{ key }}</span>
        </div>
        <div>{{ value }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "mapgis-3d-geojson-popup",
  inject: ["Cesium", "vueCesium"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {height: "120px", width: "240px"};
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
  }
}
</script>