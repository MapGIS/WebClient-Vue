<template>
  <mapgis-ui-card
    size="small"
    v-show="visible"
    :style="outStyle"
    class="mapgis-mvt-legend-card"
  >
    <span slot="extra">
      <mapgis-ui-iconfont
        class="mapgis-mvt-legend-card-toolbar"
        type="mapgis-yingyan"
      />
      <mapgis-ui-iconfont
        class="mapgis-mvt-legend-card-toolbar"
        type="mapgis-dayinP"
        @click="print"
      />
    </span>
  </mapgis-ui-card>
</template>

<script>
import printCanvas from "../../../util/print/printCanvasLayout.js";

export default {
  name: "mapgis-print",
  inject: ["mapbox", "map"],
  props: {
    outStyle: {
      type: Object,
      default: () => {
        return {
          left: "10px",
          top: "10px"
        };
      }
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: "visible",
    event: "change-visible"
  },
  data() {
    return {
      info: {
        baseinfo: {
          title: "地图标题",
          author: "中地数码有限公司",
          date: new Date().toISOString()
        },
        scale: {
          domid: "mapgis-legend-rule"
        },
        legend: {
          domid: "mapgis-legend-standard"
        }
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit("change-visible", false);
    },
    handlePrintEnd() {},
    print() {
      const { map, info } = this;
      printCanvas(map, this.handlePrintEnd, info);
    }
  }
};
</script>

<style>
.mapgis-mvt-legend-card {
  position: absolute;
  z-index: 1000;
  overflow-y: scroll;
  width: fit-content;
}

.mapgis-mvt-legend-card-toolbar {
  margin-right: 6px !important;
}

.mapgis-mvt-legend-row {
  display: inline;
}

.mapgis-mvt-legend-image {
  height: 16px;
  width: 16px;
  margin-right: 12px;
}

span.mapgis-mvt-legend-label {
  width: 120px;

  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
