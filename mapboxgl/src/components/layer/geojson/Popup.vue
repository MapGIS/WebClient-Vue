<template>
  <div class="mapgis-featuretool-content" ref="geojsontool">
    <div class="mapgis-inspect-prop-tabs">
      <mapgis-ui-tabs
        v-if="mode === 'click'"
        v-model="activeKey"
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
              <span>{{ key }}</span>
            </div>
            <div>{{ value }} ({{ parseType(typeof value) }})</div>
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
