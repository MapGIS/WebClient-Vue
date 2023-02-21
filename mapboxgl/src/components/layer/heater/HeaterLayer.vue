<template>
  <div></div>
</template>

<script>
import { uuid } from "../../util/util";

export default {
  name: "mapgis-heater-layer",
  inject: ["mapbox", "map"],
  props: {
    geojson: {
      type: [String, Object],
      required: true
    },
    field: {
      type: String,
      default: "point_count"
    },
    heaterRadius: {
      type: Number,
      default: 16
    },
    heaterColor: {
      type: [String, Array],
      default: () => {
        return [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(139, 246, 106, 0)",
          0.1,
          "rgba(139, 246, 106, 0.6)",
          0.2,
          "rgb(103,169,207)",
          0.4,
          "rgb(209,229,240)",
          0.6,
          "rgb(253,219,199)",
          0.8,
          "rgb(239,138,98)",
          1,
          "rgb(178,24,43)"
        ];
      }
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      id: uuid() + "_heater"
    };
  },
  mounted() {
    this.$_deferredMount();
  },
  watch: {
    geojson: {
      handler(next) {
        this.updateData(next);
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.$_undeferredMount();
  },
  methods: {
    $_deferredMount() {
      let {
        geojson,
        field,
        min,
        max,
        id,
        heaterRadius,
        heaterColor,
        map
      } = this;

      let source = {
        type: "geojson",
        data: geojson
      };

      this.map.addSource(id, source);
      this.map.addLayer({
        id: id,
        type: "heatmap",
        source: id,
        maxzoom: 24,
        layout: {
          visibility: "visible"
        },
        paint: {
          // increase weight as diameter breast height increases
          "heatmap-weight": {
            property: field,
            type: "exponential",
            stops: [
              [min, 0],
              [max, 1]
            ]
          },
          // increase intensity as zoom level increases
          "heatmap-intensity": {
            stops: [
              [11, 1],
              [16, 3]
            ]
          },
          // assign color values be applied to points depending on their density
          "heatmap-color": heaterColor,
          // increase radius as zoom increases
          "heatmap-radius": {
            stops: [
              [11, 15],
              [16, 20]
            ]
          },
          // decrease opacity to transition into the circle layer
          "heatmap-opacity": {
            default: 1,
            stops: [
              [12, 1],
              [15, 0.5],
              [18, 0]
            ]
          }
        }
      });
      this.$emit("added", { map, component: this, layerId: id });
    },
    $_undeferredMount() {
      let { map, id } = this;
      map.removeLayer(id);
      map.removeSource(id);
    },
    updateData(geojson) {
      let { map, id } = this;
      map.getSource(id).setData(geojson);
    }
  }
};
</script>
