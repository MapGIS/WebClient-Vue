<template>
  <mapgis-ui-list
    id="mapgis-legend-standard"
    :class="{
      'mapgis-legend-col-1': column == 1,
      'mapgis-legend-col-2': column == 2,
      'mapgis-legend-col-3': column == 3,
      'mapgis-legend-col-4': column == 4
    }"
    :grid="{ gutter: 6, column: column }"
    :data-source="legends"
  >
    <mapgis-ui-list-item
      slot="renderItem"
      class="mapgis-mvt-legend-row"
      slot-scope="item"
    >
      <template v-if="item.imageData">
        <img class="mapgis-mvt-legend-image" :src="item.imageData" />
        <span class="mapgis-mvt-legend-label">{{
          item.label.substring(0, 20)
        }}</span>
      </template>
      <template v-else-if="item.color">
        <div
          class="mapgis-mvt-legend-color"
          :style="{ background: item.color }"
        />
        <span class="mapgis-mvt-legend-theme-label">{{ item.layerName }}</span>
      </template>
    </mapgis-ui-list-item>
    <mapgis-ui-radio-group
      v-if="enableControl"
      @change="handleChangeColumn"
      size="small"
      default-value="col-1"
      slot="header"
    >
      <mapgis-ui-radio-button
        v-for="col in cols"
        :value="col.value"
        :key="col.title"
      >
        {{ col.title }}
      </mapgis-ui-radio-button>
    </mapgis-ui-radio-group>
  </mapgis-ui-list>
</template>

<script>
import MvtLegend from "../../../util/legend/mvt";

export default {
  name: "mapgis-mvt-legend",
  inject: ["mapbox", "map"],
  props: {
    enableControl: {
      type: Boolean,
      default: false
    },
    column: {
      type: Number,
      default: 1
    },
    mode: {
      type: String,
      default: "flat" // flat group
    },
    max: {
      type: Number,
      default: 100
    }
  },
  model: {
    prop: "value",
    event: "change.value"
  },
  data() {
    return {
      legends: [],
      collapse: false,
      cols: [
        {
          title: "1列",
          value: 1
        },
        {
          title: "2列",
          value: 2
        },
        {
          title: "3列",
          value: 3
        },
        {
          title: "4列",
          value: 4
        }
      ]
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
    refresh(legends) {
      if (legends) {
        if (legends.length > this.max) {
          let step = Math.floor(legends.length / this.max);
          legends = legends.filter((l, i) => {
            return i % step == 0;
          });
        }
        this.legends = legends;
      } else {
        this.getLegend(legends);
      }
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
    },
    handleChangeColumn(e) {
      this.$emit('change.value', e.target.value);
    }
  }
};
</script>

<style>
#mapgis-legend-standard {
  min-height: 60px;
  max-height: 310px;
  padding: 6px;
}

.mapgis-legend-col-1 {
  width: 180px;
}

.mapgis-legend-col-2 {
  width: 340px;
}

.mapgis-legend-col-3 {
  width: 500px;
}

.mapgis-legend-col-4 {
  width: 650px;
}

.mapgis-mvt-legend-row {
  display: inline;
}

.mapgis-mvt-legend-theme-label {
  width: 120px;
  margin-left: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.mapgis-mvt-legend-color {
  width: 24px;
  height: 24px;
}

.mapgis-mvt-legend-row > .mapgis-ui-list-item {
  width: 160px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.mapgis-ui-list-grid .mapgis-ui-col > .mapgis-ui-list-item {
  display: flex !important;
}

.mapgis-mvt-legend-image {
  height: 16px;
  width: 16px;
  margin-right: 12px;
}
</style>
