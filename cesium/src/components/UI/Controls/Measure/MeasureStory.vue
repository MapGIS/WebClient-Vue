<template>
  <div
    v-show="enableControl"
    :style="controlStyle"
    class="measure-story-control"
  >
    <mapgis-3d-measure ref="measure3d" @load="measure = $event">
      <mapgis-ui-space
        v-if="!hasSettingPanel"
        slot="measureTool"
        :style="toolbarStyle"
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
      </mapgis-ui-space>
    </mapgis-3d-measure>
  </div>
</template>
<script>
import Mapgis3dMeaure from "./Measure.vue";

export default {
  name: "measure-story",
  components: {
    "mapgis-3d-measure": Mapgis3dMeaure
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
    measure: null,
    toolbarVisible: false,
    // todo ICON
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
        tip: "直线测量",
        click: vm.enableLengthMeasure
      },
      {
        icon: "mapgis-area",
        type: "primary",
        tip: "面积测量",
        click: vm.enableAreaMeasure
      },
      {
        icon: "mapgis-huizhijuxing",
        type: "primary",
        tip: "三角测量",
        click: vm.enableTriangleMeasure
      },
      {
        icon: "mapgis-huizhijuxing",
        type: "primary",
        tip: "坡度测量",
        click: vm.enableSlopeMeasure
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
    measure3dRef() {
      return this.$refs.measure3d;
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
      this.measure3dRef.deleteMeasure();
    },
    startMeasure(measureName) {
      this.measure3dRef.$_enableMeasure(measureName);
    },
    enableToolbar() {
      this.toolbarVisible = !this.toolbarVisible;
    },
    enableLengthMeasure() {
      this.startMeasure("MeasureLengthTool");
    },
    enableAreaMeasure() {
      this.startMeasure("MeasureAreaTool");
    },
    enableTriangleMeasure() {
      this.startMeasure("TriangulationTool");
    },
    enableSlopeMeasure() {
      this.startMeasure("MeasureSlopeTool");
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
  width: 40px;
  overflow: hidden;
  transition: width 0.5s;
}

.mapgis-ui-btn.expand-btn {
  width: 40px;
  height: 40px;
}
.anticon.expand-btn {
  font-size: 20px;
}

.measure-story-control {
  width: fit-content;
  position: absolute;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 3000;
}
</style>
