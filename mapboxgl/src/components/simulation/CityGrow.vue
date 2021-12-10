<template>
  <div>
    <mapgis-ui-card
      size="small"
      hoverable
      :style="{ width: `${width}px` }"
      class="mapgis-city-grow"
    >
      <mapgis-ui-popconfirm @confirm="confirmSetting" @cancel="cancelSetting">
        <template slot="title">
          <div>颜色设置</div>
          <div>把之前的颜色色板放这里</div>
        </template>
        <mapgis-ui-iconfont
          type="mapgis-setting"
          class="mapgis-city-grow-setting"
        />
      </mapgis-ui-popconfirm>
      <mapgis-ui-slider :style="{ width: width }"> </mapgis-ui-slider>
      <span class="mapgis-city-grow-starttime">起始时间:{{ startTime }}</span>
      <div class="mapgis-city-grow-toolbar">
        <mapgis-ui-iconfont type="mapgis-chevrons-left" />
        <mapgis-ui-iconfont type="mapgis-chevron-left" />
        <!-- <mapgis-ui-button type="primary" shape="circle"> -->
        <mapgis-ui-iconfont
          type="mapgis-play-circle-fill"
          class="mapgis-city-grow-toolbar-main"
        />
        <!-- </mapgis-ui-button> -->
        <mapgis-ui-iconfont type="mapgis-chevron-right" />
        <mapgis-ui-iconfont type="mapgis-chevrons-right" />
      </div>
      <span class="mapgis-city-grow-endtime">结束时间:{{ endTime }}</span>
    </mapgis-ui-card>
  </div>
</template>

<script>
import moment from "moment";
import { MRFS } from "@mapgis/webclient-es6-service";
const { QueryDocFeature, QueryLayerFeature } = MRFS;

import { uuid } from "../util/util";
import * as turf from "@turf/turf";

export default {
  name: "mapgis-igs-feature-layer",
  inject: ["mapbox", "map"],
  /* mixins: [layerMixin], */
  props: {
    width: {
      type: Number,
      default: 500
    },
    stepTime: {
      type: Number,
      default: 60
    },
    fps: {
      type: Number,
      default: 60
    },
    startTime: {
      type: [Number, String],
      default: moment().format("L")
    },
    endTime: {
      type: [Number, String],
      default: moment().format("L")
    },
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
  created() {
    moment.locale();
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
    startGrow() {
      const { id, map, field, heightScale, stepTime, fps } = this;
      const vm = this;
      // const allTime = stepTime * 60;
      let startTime = 973935416;
      let endTime = 1636639287;
      let midTime = (startTime + endTime) / 2;

      let timeCount = endTime - startTime;
      let timeStep = timeCount / stepTime;

      let draw = function(now) {
        // console.log(now);
        let percent = vm.currenttime / stepTime;
        vm.timestamp++;
        if (vm.timestamp % fps == 0) {
          midTime = startTime + timeStep * vm.currenttime;
          vm.currenttime++;
          if (vm.currenttime >= stepTime) {
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

        // Animate the map bearing and light color over stepTime, and make the light more
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
    },
    confirmSetting() {},
    cancelSetting() {}
  }
};
</script>

<style scoped>
.mapgis-city-grow {
  position: absolute;
  left: 10px;
  bottom: 10px;
  margin: 0px auto;
}
.mapgis-city-grow-toolbar {
  display: flex;
  width: 110px;
  margin: 0px auto;
}

.mapgis-city-grow-toolbar-main {
  color: #1890ff;
}

.mapgis-city-grow-toolbar > .anticon {
  font-size: 22px;
}

.mapgis-ui-card-small > .mapgis-ui-card-body {
  padding: 6px 12px;
}

.mapgis-city-grow-starttime {
  position: absolute;
  left: 10px;
}

.mapgis-city-grow-endtime {
  position: absolute;
  right: 10px;
  bottom: 12px;
}
.mapgis-city-grow-setting {
  position: absolute;
  font-size: 18px;
  top: 4px;
  right: 4px;
}
.mapgis-ui-popover {
  background: transparent;
}
</style>
