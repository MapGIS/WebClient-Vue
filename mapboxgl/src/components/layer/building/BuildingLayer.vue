<template>
  <div></div>
</template>

<script>
import { uuid } from "../../util/util";

export default {
  name: "mapgis-building-layer",
  inject: ["mapbox", "map"],
  props: {
    geojson: {
      type: [String, Object]
    },
    /* sourceId: {
      type: String,
      default: undefined
    },
    source: {
      type: [Object, String],
      default: undefined
    },
    layerId: {
      type: String
    },
    layer: {
      type: Object,
      default: () => {
        return {};
      }
    },
    before: {
      type: String,
      default: undefined
    }, */
    vectortile: {
      type: Object,
      default: () => {
        return {
          sourceLayer: "",
          url: ""
        };
      }
    },
    field: {
      type: String
    },
    color: {
      type: String,
      default: "#ffffff"
    },
    heightScale: {
      type: Number,
      default: 1.0
    }
  },
  data() {
    return {
      id: uuid() + "_fill-extrusion"
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
      let { geojson, vectortile } = this;
      let { field, color, id, heightScale, map } = this;
      let source;
      let layerId = id;
      let sourceId = id;

      let layer = {
        id: layerId,
        type: "fill-extrusion",
        source: sourceId,
        paint: {
          "fill-extrusion-color": color,
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["*", ["get", field], heightScale]
          ],
          "fill-extrusion-opacity": 0.85
        }
      };
      if (geojson) {
        source = {
          type: "geojson",
          data: geojson
        };

        layer = { ...layer, id: layerId, source: sourceId };
      } else if (vectortile) {
        let { sourceLayer, url } = vectortile;
        source = {
          type: "vector",
          tiles: [url]
        };
        layer = {
          ...layer,
          id: layerId,
          source: sourceId,
          "source-layer": sourceLayer
        };
      }

      map.addSource(sourceId, source);
      map.addLayer(layer);
      this.$emit("added", { map, component: this, layerId });
    },
    $_undeferredMount() {
      let { map, id } = this;
      map.removeLayer(id);
      map.removeSource(id);
    }
  }
};
</script>
