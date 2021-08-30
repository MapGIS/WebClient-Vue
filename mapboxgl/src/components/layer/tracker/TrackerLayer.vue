<template>
  <div>
    <mapgis-ui-collapse-card
      v-show="visible"
      :style="outStyle"
      class="mapgis-tracker-layer-card"
      position="bottom-left"
      ref="collapsecard"
    >
      <mapgis-ui-iconfont type="mapgis-map-pin" slot="icon-hiden" />
      <span class="mapgis-mvt-legend-card-header" slot="title">
        <span class="mapgis-tracker-card-title">
          轨迹跟踪
        </span>
      </span>
      <span slot="extra">
        <mapgis-ui-iconfont
          class="mapgis-tracker-card-toolbar"
          type="mapgis-map-pin"
          @click="hide"
        />
      </span>
      <div class="mapgis-ui-tracker-timeline">
        <mapgis-ui-button-group size="small" class="mapgis-ui-tracker-buttons">
          <mapgis-ui-button size="small">
            <mapgis-ui-iconfont type="mapgis-chevrons-left"
          /></mapgis-ui-button>
          <mapgis-ui-button size="small">
            <mapgis-ui-iconfont type="mapgis-chevron-right"
          /></mapgis-ui-button>
          <mapgis-ui-button size="small">
            <mapgis-ui-iconfont type="mapgis-chevrons-right"
          /></mapgis-ui-button>
        </mapgis-ui-button-group>
        <mapgis-ui-slider :style="{ width: '240px', 'line-height': '30px' }" />
      </div>
    </mapgis-ui-collapse-card>
    <slot name="popup" />
  </div>
</template>

<script>
import * as turf from "@turf/turf";
export default {
  name: "mapgis-tracker-layer",
  inject: ["mapbox", "map"],
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    outStyle: {
      type: Object,
      default: () => {
        return {
          width: "400px",
          padding: "10px",
          left: "10px",
          bottom: "10px"
        };
      }
    },
    geojson: {
      type: [String, Object],
      required: true
    },
    follow: {
      type: Boolean,
      default: false
    },
    bearing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: (Math.random() * 100000000).toFixed(0),
      pinRoute: undefined,
      path: undefined,
      pathDistance: 1,
      popup: undefined,
      marker: undefined,
      start: undefined,
      collapse: false
    };
  },
  model: {
    prop: "visible",
    event: "change-visible"
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleClose() {
      this.$emit("change-visible", false);
    },
    hide() {
      if (this.$refs.collapsecard) {
        this.$refs.collapsecard.hide();
      }
    },
    getData() {
      let { geojson } = this;
      const vm = this;
      if (typeof geojson === "string") {
        fetch(geojson)
          .then(response => response.json())
          .then(pinRouteGeojson => {
            vm.handleDynamicLine(pinRouteGeojson);
          });
      } else {
        this.handleDynamicLine(geojson);
      }
    },
    handleDynamicLine(pinRouteGeojson) {
      let { map, id, follow, bearing, mapbox } = this;
      let layerid = `tracker_layer_${id}`;

      if (!pinRouteGeojson.features) return;
      if (pinRouteGeojson.features.length <= 0) return;
      if (pinRouteGeojson.features[0].geometry.type != "LineString") return;

      this.pinRoute = pinRouteGeojson.features[0].geometry.coordinates;

      const popup = new mapbox.Popup({ closeButton: false });
      const marker = new mapbox.Marker({
        color: "red",
        scale: 0.8,
        draggable: false,
        pitchAlignment: "auto",
        rotationAlignment: "auto"
      })
        .setLngLat(this.pinRoute[0])
        .setPopup(popup)
        .addTo(map)
        .togglePopup();
      this.popup = popup;
      this.marker = marker;

      map.addSource(layerid, {
        type: "geojson",
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true,
        data: pinRouteGeojson
      });
      map.addLayer({
        type: "line",
        source: layerid,
        id: layerid,
        paint: {
          "line-color": "rgba(0,0,0,0)",
          "line-width": 15,
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            "blue",
            0.1,
            "royalblue",
            0.3,
            "cyan",
            0.5,
            "lime",
            0.7,
            "yellow",
            1,
            "red"
          ]
        },
        layout: {
          "line-cap": "round",
          "line-join": "round"
        }
      });
      this.initFrameParm();
      window.requestAnimationFrame(this.frame);
    },
    initFrameParm() {
      let { pinRoute } = this;
      const path = turf.lineString(pinRoute);
      const pathDistance = turf.lineDistance(path);
      this.path = path;
      this.pathDistance = pathDistance;
    },
    frame(time) {
      let {
        map,
        path,
        pathDistance,
        popup,
        marker,
        id,
        bearing,
        follow,
        start
      } = this;
      let layerid = `tracker_layer_${id}`;
      const animationDuration = 20000;
      if (!start) start = this.start = time;
      const animationPhase = (time - start) / animationDuration;
      if (animationPhase > 1) {
        return;
      }

      const alongPath = turf.along(path, pathDistance * animationPhase).geometry
        .coordinates;
      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1]
      };
      let elevation;
      if (map.queryTerrainElevation) {
        elevation = Math.floor(
          map.queryTerrainElevation(lngLat, { exaggerated: false })
        );
      }

      if (this.$slots.popup && this.$slots.popup.length > 0) {
        this.popup.setDOMContent(this.$slots.popup[0].elm);
      } else {
        popup.setHTML("高度: " + elevation + "m<br/>");
      }

      marker.setLngLat(lngLat);

      let steps = [];
      let colors = [
        "blue",
        "royalblue",
        "cyan",
        "lime",
        "yellow",
        "red",
        "rgba(255, 0, 0, 0)"
      ];
      let step = animationPhase / colors.length;
      for (var i = 0; i < colors.length; i++) {
        let percent = 0 + (i + 1) * step;
        steps.push(percent);
        steps.push(colors[i]);
      }
      if (map.getLayer(layerid)) {
        map.setPaintProperty(
          layerid,
          "line-gradient",
          ["interpolate", ["linear"], ["line-progress"]].concat(steps)
        );
      }

      const rotation = 150 - animationPhase * 40.0;

      if (bearing) map.setBearing(rotation % 360);
      if (follow) map.setCenter([alongPath[0], alongPath[1]]);

      window.requestAnimationFrame(this.frame);
    }
  },
  destroyed() {
    let { map, id, popup, marker } = this;
    let layerid = `tracker_layer_${id}`;
    map.removeLayer(layerid);
    map.removeSource(layerid);
    marker && marker.remove();
    popup && popup.remove();
    window.cancelAnimationFrame(this.frame);
  }
};
</script>

<style>
.mapgis-tracker-layer-card {
  position: absolute;
  z-index: 1000;
  width: fit-content;
}
.mapgis-ui-tracker-timeline {
  display: flex;
}
.mapgis-ui-tracker-buttons {
  padding: 6px;
}
.mapgis-tracker-card-toolbar {
  float: right;
  margin-right: 6px !important;
  font-size: 16px;
}
</style>
