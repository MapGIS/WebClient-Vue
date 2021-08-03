<template>
  <div></div>
</template>

<script>
import { uuid } from "../../util/util";

export default {
  name: "mapgis-cluster-layer",
  inject: ["mapbox", "map"],
  props: {
    geojson: {
      type: [String, Object],
      required: true
    },
    clusterMaxZoom: {
      type: Number,
      default: 14
    },
    clusterRadius: {
      type: Number,
      default: 50
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      id: uuid()
    };
  },
  mounted() {
    this.$_deferredMount();
  },
  beforeDestroy() {
    this.$_undeferredMount();
  },
  methods: {
    $_deferredMount() {
      let { geojson, min, max, id, clusterMaxZoom, clusterRadius, map } = this;
      let source = {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: clusterMaxZoom, // 聚合最大级别
        clusterRadius: clusterRadius // 聚合半径
      };

      map.addSource(id, source);
      map.addLayer({
        id: id + "_circle",
        type: "circle",
        source: id,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            (min + max) / 2,
            "#f1f075",
            max,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            10,
            min,
            20,
            max,
            30
          ],
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2
        }
      });
      map.addLayer({
        id: id + "_label",
        type: "symbol",
        source: id,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["微软雅黑", "微软雅黑"],
          "text-size": 16
        },
        paint: {
          "text-halo-color": "#ffffff",
          "text-halo-width": 2
        }
      });
      this.$emit("added", {
        map,
        component: this,
        layerIds: [id + "_circle", id + "_label"]
      });
    },
    $_undeferredMount() {
      let { map, id } = this;
      map.removeLayer(id + "_circle");
      map.removeLayer(id + "_label");
      map.removeSource(id);
    }
  }
};
</script>
