<template>
  <div class="mapgis-measure-control" v-show="enableControl">
    <mapgis-ui-space ref="control">
      <mapgis-ui-tooltip
        v-for="(item, i) in measures"
        :key="i"
        placement="bottom"
      >
        <template slot="title">
          <span>{{ item.tip }}</span>
        </template>
        <mapgis-ui-button
          shape="circle"
          @click="iconClick(item)"
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
      :coordinates="coordinates"
      color="#ff0000"
    >
      <div slot="marker" class="mapgis-measure-control-label">
        <div>面积：{{ result.geographyArea }}</div>
        <div>周长：{{ result.geographyPerimeter }}</div>
      </div>
    </mapgis-marker>
  </div>
</template>
<script>
import { measureModeMap } from "../store/enums";

export default {
  name: "measure-story",
  props: {
    expandControl: {
      type: Boolean,
      default: false
    },
    enableControl: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: "top-right"
    },
    result: {
      type: Object,
      default: () => ({})
    }
  },
  data: vm => ({
    measures: [
      {
        icon: "mapgis-huizhi1",
        type: "primary",
        tip: "展开",
        click: vm.changeFold,
        className: "mapgis-measure-expand"
      },
      {
        icon: "mapgis-ruler",
        type: "primary",
        tip: "长度",
        mode: measureModeMap.line
      },
      {
        icon: "mapgis-area",
        type: "primary",
        tip: "面积",
        mode: measureModeMap.polygon
      },
      {
        icon: "mapgis-shanchu_dianji",
        type: "primary",
        tip: "清空图元",
        click: vm.clear
      }
    ]
  }),
  computed: {
    controlEl() {
      return this.$refs.control.$el;
    },
    coordinates({ result }) {
      return result.center ? result.center.geometry.coordinates : [];
    }
  },
  methods: {
    changeFold(e) {
      this.controlEl.style =
        getComputedStyle(this.controlEl).width == "40px"
          ? "width: 160px!important"
          : "width: 40px!important";
    },
    enableMeasure() {
      this.$parent.enableMeasure();
    },
    clear() {
      this.$parent.clear();
    },
    iconClick(item) {
      if (item.mode) {
        this.$parent.changeMode(item.mode);
      } else if (item.click) {
        item.click();
      }
    }
  },
  mounted() {
    if (this.enableControl) {
      this.enableMeasure();
      if (this.expandControl) {
        this.changeFold();
      } else {
        const [first, secend] = this.position.split("-");
        this.controlEl.style = `${first}: 10px;${secend}: 10px;`;
      }
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
  /*top: 10px;*/
  /*left: 10px;*/
  z-index: 3000;
}
</style>
