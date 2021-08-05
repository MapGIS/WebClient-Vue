<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { uuid } from "../../util/util";
import * as turf from "@turf/turf";

export default {
  name: "mapgis-building-layer",
  inject: ["mapbox", "map"],
  props: {
    geojson: {
      type: [String, Object]
    },
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
    opacity: {
      type: [Number, Object],
      default: 0.85
    },
    heightScale: {
      type: Number,
      default: 1.0
    },
    feature: {
      geometry: {},
      properties: { 属性名: "属性值" }
    }
  },
  data() {
    return {
      id: uuid() + "_fill-extrusion",
      coordinates: [0, 0],
      properties: {
        属性名: "属性值"
      }
    };
  },
  model: {
    prop: "feature",
    event: "change-feature"
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
      let { field, color, opacity, id, heightScale, map } = this;
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
          "fill-extrusion-opacity": opacity
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
      this.$_bindEvent();
    },
    $_undeferredMount() {
      let { map, id } = this;
      map.removeLayer(id);
      map.removeSource(id);
      this.$_unbindEvent();
    },
    $_bindEvent() {
      const vm = this;
      let { map, id } = this;
      map.on("click", id, function(e) {
        if (!e.features || e.features.length <= 0) return;
        var properties = e.features[0].properties;

        let center = turf.centroid(e.features[0]);

        vm.coordinates = center.geometry.coordinates;
        vm.properties = properties;

        vm.$emit("change-feature", {
          coordinates: center,
          properties: properties
        });

        vm.$nextTick(() => {
          vm.updatePopup();
        });
      });
    },
    $_unbindEvent() {
      let { map, id } = this;
      map.off("click", id, function(e) {});
    },
    updatePopup() {
      const { map, mapbox, coordinates } = this;
      if (this.popup) {
        this.popup.remove();
      }
      if (this.$slots.default !== undefined) {
        this.popup = new mapbox.Popup({ closeButton: true })
          .setLngLat(coordinates)
          .setDOMContent(this.$slots.default[0].elm)
          .addTo(map);
      }
    }
  }
};
</script>
