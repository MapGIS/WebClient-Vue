<template>
  <mapgis-ui-collapse-card
    v-show="visible"
    :style="outStyle"
    class="mapgis-mvt-legend-card"
    iconfont="mapgis-tuli"
    ref="collapsecard"
  >
    <div class="mapgis-mvt-legend-card-header" slot="title">
      <span class="mapgis-mvt-legend-card-title">
        图例
      </span>
      <mapgis-ui-iconfont
        class="mapgis-mvt-legend-card-toolbar"
        type="mapgis-tuli"
        @click="hide"
      />
      <mapgis-ui-iconfont
        class="mapgis-mvt-legend-card-toolbar"
        type="mapgis-shuaxinmulu"
        @click="refresh"
      />
    </div>
    <mapgis-ui-list :grid="{ gutter: 0, column: 1 }" :data-source="legends">
      <mapgis-ui-list-item
        slot="renderItem"
        class="mapgis-mvt-legend-row"
        slot-scope="item"
      >
        <img class="mapgis-mvt-legend-image" :src="item.imageData" />
        <span class="mapgis-mvt-legend-label">{{
          item.label.substring(0, 20)
        }}</span>
      </mapgis-ui-list-item>
    </mapgis-ui-list>
  </mapgis-ui-collapse-card>
</template>

<script>
import MvtLegend from "../../../util/legend/mvt";

export default {
  name: "mapgis-mvt-legend",
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
    },
    mode: {
      type: String,
      default: "flat" // flat group
    }
  },
  model: {
    prop: "visible",
    event: "change-visible"
  },
  data() {
    return {
      legends: [],
      collapse: false
    };
  },
  watch: {},
  mounted() {
    this.getLegend();
  },
  methods: {
    handleClose() {
      this.$emit("change-visible", false);
    },
    getLegend() {
      const { map, mode } = this;
      if (!map) return;
      let mvt = new MvtLegend();
      let legends = mvt.getLegend({ map });
      let array = [];
      switch (mode) {
        case "flat":
          legends.forEach(l => {
            if (l.legend && l.legend.length > 0) {
              array = array.concat(l.legend);
            }
          });
          break;
        case "group":
          break;
      }
      this.legends = array;
    },
    refresh() {
      this.getLegend();
    },
    hide() {
      if (this.$refs.collapsecard) {
        this.$refs.collapsecard.hide();
      }
    },
    show() {
      if (this.$refs.collapsecard) {
        this.$refs.collapsecard.show();
      }
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
.mapgis-mvt-legend-card-collapse {
  float: right;
}
.mapgis-mvt-legend-card
  .mapgis-ui-list-grid
  .mapgis-ui-col
  > .mapgis-ui-list-item {
  margin-bottom: 6px !important;
}

.mapgis-mvt-legend-card-title {
  font-size: 16px;
  font-weight: bolder;
  line-height: 20px;
}

.mapgis-mvt-legend-card-toolbar {
  float: right;
  margin-right: 6px !important;
  font-size: 16px;
}

.mapgis-mvt-legend-row {
  display: inline;
}

.mapgis-mvt-legend-row > .mapgis-ui-list-item {
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.mapgis-mvt-legend-image {
  height: 16px;
  width: 16px;
  margin-right: 12px;
}
</style>
