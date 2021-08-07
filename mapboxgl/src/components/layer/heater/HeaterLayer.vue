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
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", field],
            min,
            0,
            max,
            1
          ],
          /* "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
            16,
            6
          ], */
          "heatmap-color": heaterColor,
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            2,
            9,
            heaterRadius / 2,
            16,
            heaterRadius,
            20,
            heaterRadius * 1.5
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            1,
            9,
            0.9,
            20,
            0.6
          ]
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
