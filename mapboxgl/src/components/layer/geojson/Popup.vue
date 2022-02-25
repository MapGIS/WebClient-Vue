<template>
  <div class="mapgis-popup-container" v-if="mode === 'click'">
    <div v-if="currentLayerInfo && currentLayerInfo.length > 0">
      <mapgis-ui-popup-content
        :feature="feature"
        :popupOptions="popupOptions"
      />
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
    },
    popupOptions: {
      type: Object,
      default() {
        return {
          popupType: "default"
        };
      }
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
  computed: {
    // 计算属性的 getter
    feature: function() {
      const { currentLayerInfo } = this;
      let fs = {};
      if (currentLayerInfo && currentLayerInfo.length > 0) {
        fs.properties = currentLayerInfo[0].properties;
      }
      return fs;
    }
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

<style></style>
