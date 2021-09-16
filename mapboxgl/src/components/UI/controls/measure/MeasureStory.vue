<template>
  <div class="mapgis-measure-control" v-show="enableControl">
    <mapgis-measure ref="mapgisMeasure" @measureresult="measureResult = $event">
      <template v-if="!hasSettingPanel">
        <mapgis-ui-space ref="toolbar" slot="measureTool">
          <mapgis-ui-tooltip
            v-for="(item, i) in tools"
            :key="i"
            placement="bottom"
          >
            <template slot="title">
              <span>{{ item.tip }}</span>
            </template>
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
      </template>
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
    tools: [
      {
        icon: "mapgis-huizhi1",
        type: "primary",
        tip: "展开",
        click: vm.toggleToolbar,
        className: "mapgis-measure-expand"
      },
      {
        icon: "mapgis-ruler",
        type: "primary",
        tip: "长度",
        click: vm.toolbarMeasureIconClick,
        mode: measureModeMap.line
      },
      {
        icon: "mapgis-area",
        type: "primary",
        tip: "面积",
        click: vm.toolbarMeasureIconClick,
        mode: measureModeMap.polygon
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
    toolbarEl() {
      return this.$refs.toolbar.$el;
    },
    coordinates({ measureResult }) {
      return measureResult && measureResult.center
        ? measureResult.center.geometry.coordinates
        : [];
    }
  },
  methods: {
    initToolbar() {
      if (this.expandControl) {
        this.toggleToolbar();
      } else {
        const [first, secend] = this.position.split("-");
        this.toolbarEl.style = `${first}: 10px;${secend}: 10px;`;
      }
    },
    toggleToolbar() {
      this.toolbarEl.style =
        getComputedStyle(this.toolbarEl).width == "40px"
          ? "width: 160px!important"
          : "width: 40px!important";
    },
    toolbarMeasureIconClick({ mode }) {
      this.clearMeasure();
      this.enableMeasure(mode);
    },
    clearMeasure() {
      this.measureResult = null;
      this.measureRef.remove();
    },
    enableMeasure(mode) {
      this.measureRef.enableMeasure();
      this.measureRef.changeMode(mode);
    }
  },
  mounted() {
    if (!this.enableControl) return;
    if (!this.hasSettingPanel) {
      // 非设置面板初始化
      this.initToolbar();
    } else {
      // 设置面板
    }
  }
};
</script>
<style scoped>
.mapgis-measure-control > .mapgis-ui-space {
  width: 40px !important;
  overflow: hidden;
  transition: width 0.5s;
}

.mapgis-measure-expand.mapgis-ui-btn {
  width: 40px !important;
  height: 40px !important;
}
.mapgis-measure-expand.anticon {
  font-size: 19px !important;
}

.mapgis-measure-control {
  width: fit-content;
  position: absolute;
  max-height: 100%;
  overflow-y: auto;
  background-color: #fff;
  z-index: 3000;
}
</style>
