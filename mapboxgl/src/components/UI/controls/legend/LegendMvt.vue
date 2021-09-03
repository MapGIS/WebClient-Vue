<template>
  <mapgis-ui-list
    id="mapgis-legend-standard"
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
        item.label.substring(0, 20)
      }}</span>
    </mapgis-ui-list-item>
  </mapgis-ui-list>
</template>

<script>
import MvtLegend from "../../../util/legend/mvt";

export default {
  name: "mapgis-mvt-legend",
  inject: ["mapbox", "map"],
  props: {
    mode: {
      type: String,
      default: "flat" // flat group
    }
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
#mapgis-legend-standard {
  height: 260px;
  padding: 6px;
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
