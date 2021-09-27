<template>
  <div
    v-show="enableControl"
    :style="controlStyle"
    class="measure-story-control"
  >
    <mapgis-measure ref="mapgisMeasure" @measureresult="measureResult = $event">
      <mapgis-ui-space
        v-if="!hasSettingPanel"
        :style="toolbarStyle"
        slot="measureTool"
      >
        <mapgis-ui-tooltip
          v-for="(item, i) in toolbarBtns"
          :key="i"
          placement="bottom"
        >
          <span slot="title">{{ item.tip }}</span>
          <mapgis-ui-button
            shape="circle"
            @click="item.click(item)"
            :type="item.type"
            :class="item.className"
          >
            <mapgis-ui-iconfont
              :type="item.icon"
              :class="item.className"
              theme="filled"
            />
          </mapgis-ui-button>
        </mapgis-ui-tooltip>
        <mapgis-marker
          v-if="!!coordinates.length && enableControl"
          slot="measureMarker"
          :coordinates="coordinates"
          color="#ff0000"
        >
          <div slot="marker" class="mapgis-measure-control-label">
            <div v-if="measureResult.geographyArea">
              面积：{{ measureResult.geographyArea }}
            </div>
            <div>周长：{{ measureResult.geographyPerimeter }}</div>
          </div>
        </mapgis-marker>
      </mapgis-ui-space>
    </mapgis-measure>
  </div>
</template>
<script>
import { measureModeMap } from "./store/enums";
import MapgisMeasure from "./Measure.vue";

export default {
  name: "measure-story",
  components: {
    MapgisMeasure
  },
  props: {
    expandControl: {
      type: Boolean,
      default: false
    },
    enableControl: {
      type: Boolean,
      default: false
    },
    hasSettingPanel: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "top-right"
    }
  },
  data: vm => ({
    measureResult: null,
    toolbarVisible: false,
    toolbarBtns: [
      {
        icon: "mapgis-huizhi1",
        type: "primary",
        tip: "展开",
        click: vm.enableToolbar,
        className: "expand-btn"
      },
      {
        icon: "mapgis-ruler",
        type: "primary",
        tip: "长度",
        click: vm.enableLengthMeasure
      },
      {
        icon: "mapgis-area",
        type: "primary",
        tip: "面积",
        click: vm.enableAreaMeasure
      },
      {
        icon: "mapgis-shanchu_dianji",
        type: "primary",
        tip: "清空图元",
        click: vm.clearMeasure
      }
    ]
  }),
  computed: {
    measureRef() {
      return this.$refs.mapgisMeasure;
    },
    coordinates({ measureResult }) {
      return measureResult && measureResult.center
        ? measureResult.center.geometry.coordinates
        : [];
    },
    controlStyle({ hasSettingPanel }) {
      return {
        background: hasSettingPanel ? "#fff" : "transparent"
      };
    },
    toolbarStyle({ position, toolbarVisible }) {
      const [first, secend] = position.split("-");
      return {
        width: `${toolbarVisible ? 160 : 40}px`,
        [first]: "10px",
        [secend]: "10px"
      };
    }
  },
  methods: {
    clearMeasure() {
      this.measureResult = null;
      this.measureRef.remove();
    },
    startMeasure(mode) {
      this.measureRef.enableMeasure();
      this.measureRef.changeMode(mode);
    },
    enableToolbar() {
      this.toolbarVisible = !this.toolbarVisible;
    },
    enableLengthMeasure() {
      this.clearMeasure();
      this.startMeasure(measureModeMap.line);
    },
    enableAreaMeasure() {
      this.clearMeasure();
      this.startMeasure(measureModeMap.polygon);
    }
  },
  mounted() {
    if (!this.enableControl) return;
    if (!this.hasSettingPanel) {
      this.toolbarVisible = this.expandControl;
    }
  }
};
</script>
<style scoped>
.measure-story-control > .mapgis-ui-space {
  width: 40px !important;
  overflow: hidden;
  transition: width 0.5s;
}

.mapgis-ui-btn.expand-btn {
  width: 40px !important;
  height: 40px !important;
}
.anticon.expand-btn {
  font-size: 20px !important;
}

.measure-story-control {
  width: fit-content;
  position: absolute;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1000;
}
</style>
