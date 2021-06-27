<template>
  <div>
    <slot name="popup" />
  </div>
</template>

<script>
import * as turf from "@turf/turf";
export default {
  name: "mapgis-tracker-layer",
  inject: ["mapbox", "map"],
  props: {
    url: {
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
      start: undefined
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let { url } = this;
      const vm = this;
      if (typeof url === "string") {
        fetch(url)
          .then(response => response.json())
          .then(pinRouteGeojson => {
            vm.handleDynamicLine(pinRouteGeojson);
          });
      } else {
        this.handleDynamicLine(url);
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

      const elevation = Math.floor(
        map.queryTerrainElevation(lngLat, { exaggerated: false })
      );
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
