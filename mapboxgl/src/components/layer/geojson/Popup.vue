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
          <span class="mapgis-popup-item mapgis-popup-value">{{ value }} ({{ parseType(typeof value) }})</span>
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
  name: "mapgis-geojson-popup",
  inject: ["map", "mapbox"],
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
  },
  methods: {
    parseType(type) {
      let string = "未知";
      if (type == "string") {
        string = "字符";
      } else if (type == "number") {
        string = "数值";
      }
      return string;
    }
  }
};
</script>

<style>
.mapgis-featuretool-content {
  position: absolute;
  z-index: 1000;
  height: 0px;  /** 这里会触发draw绘制的时候溢出Bug */
  /* width: 240px;*/ /* 此处不能给宽度,不然初始化的时候会溢出 */
}

.mapgis-inspect-prop-tabs {
  width: 240px;
}

.mapgis-inspect-prop-content {
  height: 220px;
  width: 240px;
  overflow-x: hidden;
  overflow-y: scroll;
  /* 针对火狐浏览器 */
  scrollbar-color: transparent transparent;
  scrollbar-width: thin;
}

.mapgis-inspect-layer-name {
  width: 80px;
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
