<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import layerMixin from "../layer/layerMixin";
import layerEvents from "../../lib/layerEvents";
import clonedeep from "lodash.clonedeep";

import { MRFS } from "@mapgis/webclient-es6-service";
const { QueryDocFeature, QueryLayerFeature } = MRFS;

import { uuid } from "../util/util";
import * as turf from "@turf/turf";

export default {
  name: "mapgis-igs-feature-layer",
  inject: ["mapbox", "map"],
  /* mixins: [layerMixin], */
  props: {
    // --------------------IGServer小数据-----------------
    baseUrl: {
      type: String,
      default: null
    },
    mapIndex: {
      type: Number,
      default: 0
    },
    layers: {
      type: [String, Array],
      default: null
    },
    tileFeaturesCount: {
      type: Number,
      default: 400
    },
    filter: {
      type: String,
      default: null
    },
    layerStyle: {
      type: Object,
      default: null
    },
    guid: {
      type: String,
      default: new Date().getTime().toString()
    },
    // --------------------矢量瓦片大数据-----------------
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
    },

    time: {
      type: Number,
      default: 60
    },
    fps: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      id: uuid() + "_fill-extrusion",
      coordinates: [0, 0],
      properties: {
        属性名: "属性值"
      },
      timestamp: 0,
      currenttime: 0
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
          "fill-extrusion-height": ["*", ["get", field], heightScale],
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
    },
    startGlow() {
      const { id, map, field, heightScale, time, fps } = this;
      const vm = this;
      // const allTime = time * 60;
      let startTime = 973935416;
      let endTime = 1636639287;
      let midTime = (startTime + endTime) / 2;

      let timeCount = endTime - startTime;
      let timeStep = timeCount / time;

      let draw = function(now) {
        // console.log(now);
        let percent = vm.currenttime / time;
        vm.timestamp++;
        if (vm.timestamp % fps == 0) {
          midTime = startTime + timeStep * vm.currenttime;
          vm.currenttime++;
          if (vm.currenttime >= time) {
            vm.currenttime = 0;
            vm.timestamp = 0;
          }
        }
        let height = percent * heightScale;
        map.setPaintProperty(id, "fill-extrusion-height", [
          "*",
          ["get", field],
          height
        ]);
        let case1 = [">=", ["get", "startTime"], startTime];
        let case2 = [">=", ["get", "startTime"], midTime];
        let case3 = [">=", ["get", "startTime"], endTime];
        /* let colors = [
          "case",
          case1,
          "#fff0f6",
          case2,
          "#ff85c0",
          case3,
          "#eb2f96",
          "#520339"
        ]; */

        let colors = {
          property: "startTime",
          stops: [
            [startTime, "#fff0f6"],
            [midTime, "#ff85c0"],
            [endTime, "#eb2f96"]
          ]
        };
        map.setPaintProperty(id, "fill-extrusion-color", colors);
        map.setFilter(id, ["<=", ["get", "startTime"], midTime]);

        // Animate the map bearing and light color over time, and make the light more
        // intense when the audio is louder.
        /* map.setBearing(now / 500);
        const hue = (now / 100) % 360;
        const saturation = Math.min(50 + avg / 4, 100);
        map.setLight({
          color: `hsl(${hue},${saturation}%,50%)`,
          intensity: Math.min(1, (avg / 256) * 10)
        }); */

        requestAnimationFrame(draw);
      };

      requestAnimationFrame(draw);
    }
  }
};
</script>
