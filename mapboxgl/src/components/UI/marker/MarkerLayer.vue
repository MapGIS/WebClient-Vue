<template>
  <div>
    <mapgis-marker-set-pro
      :markers="markers"
      @mouseenter="mouseEnterEvent"
      @mouseleave="mouseLeaveEvent"
    >
      <template slot="popup" slot-scope="slotProps">
        <slot name="popup" v-bind="slotProps"></slot>
      </template>
    </mapgis-marker-set-pro>
  </div>
</template>

<script>
import MapgisMarkerSetPro from "./MarkerSetPro.vue";
import * as turfjs from "@turf/turf";

const DefaultMarkerImagePlotting =
  "data:image/png;base64,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";

export default {
  name: "mapgis-marker-layer",
  components: { MapgisMarkerSetPro },
  inject: ["map"],
  props: {
    data: {
      type: [Object, String],
      required: true
    },
    style: {
      type: Object,
      default: () => {
        return {};
      }
    },
    fitBound: {
      type: Object,
      default: () => {
        return {};
      }
    },
    idField: {
      type: String,
      default: "markerId"
    },
    selects: {
      type: Array,
      default: () => []
    },
    filterWithMap: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    highlightStyle: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    move() {
      let timeout;
      return event => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          // 根据范围过滤回调
          const { target } = event;
          const { _ne, _sw } = target.getBounds();
          const { lng: xmax, lat: ymax } = _ne;
          const { lng: xmin, lat: ymin } = _sw;
          const bound = {
            xmin,
            ymin,
            xmax,
            ymax
          };
          this.$emit("map-bound-change", bound);
        }, 1000);
      };
    }
  },
  data() {
    return {
      markers: []
    };
  },
  mounted() {
    this.parseData();
  },
  watch: {
    data: {
      handler(next) {
        this.parseData(next);
      },
      deep: true
    },
    selects: {
      // 直接传递需要高亮的元素, 希望能支持任何要素的高亮
      handler(markers, prevMarkers = []) {
        prevMarkers.forEach(this.onClearHighlightFeature);
        markers.forEach(this.onHighlightFeature);
      }
    },
    fitBound: {
      deep: true,
      handler(nV) {
        this.zoomTo(nV);
      }
    },
    selectionBound: {
      deep: true,
      handler(nV) {
        this.zoomOrPanTo(nV);
      }
    },
    filterWithMap(val) {
      if (val) {
        this.map.on("move", this.move);
      } else {
        this.map.off("move", this.move);
      }
    },
    center: {
      deep: true,
      handler() {
        this.map.panTo(this.center);
      }
    }
  },
  methods: {
    parseData(data) {
      data = data || this.data;
      const vm = this;
      if (typeof data === "string") {
        fetch(data)
          .then(function(response) {
            return response.json();
          })
          .then(function(resdata) {
            console.log("parseData", resdata);
            vm.parseMarker(resdata);
          });
      } else {
        vm.parseMarker(data);
      }
    },
    parseMarker(geojson) {
      const { idField } = this;
      if (!geojson || !geojson.features) {
        console.warn("请输入标准的GEOJSON格式，目前只支持FeatureCollection");
        return;
      }
      let markers = geojson.features.map((f, i) => {
        let coordinates = turfjs.center(f).geometry.coordinates;
        console.log("coordinates", coordinates);
        let id =
          f.properties && f.properties[idField] ? f.properties[idField] : i;
        let marker = {
          markerId: id,
          coordinates,
          img: DefaultMarkerImagePlotting,
          properties: f.properties,
          feature: f
        };

        return marker;
      });
      this.markers = markers;
    },
    getMarker(markerId) {
      return this.markers.find(marker => marker.markerId === markerId);
    },
    isSelectedMarker(id) {
      return this.selects.findIndex(({ markerId }) => markerId === id) !== -1;
    },
    zoomTo(bound) {
      if (!bound) return;
      this.map.fitBounds([
        [bound.xmin, bound.ymin],
        [bound.xmax, bound.ymax]
      ]);
    },
    zoomOrPanTo(bound) {
      if (!bound) return;
      const mapBoundArray = this.map.getBounds().toArray();
      const mapBound = {
        xmin: mapBoundArray[0][0],
        ymin: mapBoundArray[0][1],
        xmax: mapBoundArray[1][0],
        ymax: mapBoundArray[1][1]
      };
      // 先查看是否在地图范围内
      if (
        bound.xmin > mapBound.xmin &&
        bound.ymin > mapBound.ymin &&
        bound.xmax < mapBound.xmax &&
        bound.ymax < mapBound.ymax
      ) {
        return;
      }
      // 然后查看两个矩形的范围大小，如果选择集的范围较当前大，需要做缩放
      if (
        bound.xmax - bound.xmin > mapBound.xmax - mapBound.xmin ||
        bound.ymax - bound.ymin > mapBound.ymax - mapBound.ymin
      ) {
        this.zoomTo(bound);
      } else {
        this.map.panTo([
          (bound.xmin + bound.xmax) / 2,
          (bound.ymin + bound.ymax) / 2
        ]);
      }
    },
    mouseEnterEvent(e, id) {
      const marker = this.getMarker(id);
      if (marker && !this.isSelectedMarker(id)) {
        this.highlightFeature(marker);
      }
    },
    mouseLeaveEvent(e, id) {
      const marker = this.getMarker(id);
      if (marker && !this.isSelectedMarker(id)) {
        this.clearHighlightFeature(marker);
      }
    },
    highlightFeature({ markerId, feature }) {
      if (!feature) return;
      let { highlightStyle } = this;
      const layerId = `highlight-layer-${markerId}`;
      const sourceId = `highlight-${markerId}`;
      if (!this.map.getSource(sourceId)) {
        this.map.addSource(sourceId, {
          type: "geojson",
          data: {
            features: [feature],
            type: "FeatureCollection"
          }
        });
      }
      let options = {};
      if (!highlightStyle) return;
      if (!highlightStyle.feature) return;
      const { pnt, line, reg } = highlightStyle.feature;
      if (!feature || !feature.geometry) return;
      switch (feature.geometry.type) {
        case "Point":
          // 点要素的高亮符号怎么处理?
          options = {
            type: "circle",
            paint: {
              "circle-color": pnt.color,
              "circle-radius": parseInt(pnt.size)
            }
          };
          break;
        case "LineString":
          options = {
            type: "line",
            paint: {
              "line-color": line.color,
              "line-width": parseInt(line.size)
            }
          };
          break;
        case "Polygon":
          options = {
            type: "fill",
            paint: {
              "fill-color": reg.color,
              "fill-outline-color": line.color
            }
          };
          break;
        default:
          break;
      }
      if (!this.map.getLayer(layerId)) {
        this.map.addLayer({
          id: layerId,
          source: sourceId,
          ...options
        });
      }
    },
    clearHighlightFeature({ markerId }) {
      const layerId = `highlight-layer-${markerId}`;
      const sourceId = `highlight-${markerId}`;
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
      }
      if (this.map.getSource(sourceId)) {
        this.map.removeSource(sourceId);
      }
    },
    onClearHighlightFeature(marker) {
      this.clearHighlightFeature(marker);
    },
    onHighlightFeature(marker) {
      this.zoomOrPanTo(marker.feature.bound);
      this.highlightFeature(marker);
    }
  }
};
</script>
