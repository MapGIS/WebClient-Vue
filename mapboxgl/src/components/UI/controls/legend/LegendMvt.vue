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
        type="mapgis-tuli"
        @click="refresh"
      />
    </span>
    <mapgis-ui-list
      v-if="legends.length > 0"
      :grid="{ gutter: 0, column: 1 }"
      :data-source="legends"
    >
      <mapgis-ui-list-item
        slot="renderItem"
        class="mapgis-mvt-legend-row"
        slot-scope="item"
      >
        <img class="mapgis-mvt-legend-image" :src="item.imageData" />
        <span class="mapgis-mvt-legend-label">{{
          item.label.substring(0, 12)
        }}</span>
      </mapgis-ui-list-item>
    </mapgis-ui-list>
  </mapgis-ui-card>
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
      legends: []
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
