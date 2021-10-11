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

export default {
  name: "mapgis-marker-plotting",
  components: { MapgisMarkerSetPro },
  inject: ["map"],
  props: {
    vueKey: String,
    filterWithMap: {
      type: Boolean,
      default: false
    },
    selectedMarkers: {
      type: Array,
      default: () => []
    },
    markers: {
      type: Array,
      required: true
    },
    fitBound: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selectionBound: {
      type: Object,
      default: () => {
        return {};
      }
    },
    center: {
      type: Array,
      default: () => {
        return [0, 0];
      }
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
  watch: {
    selectedMarkers: {
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
    getMarker(markerId) {
      return this.markers.find(marker => marker.markerId === markerId);
    },
    isSelectedMarker(id) {
      return (
        this.selectedMarkers.findIndex(({ markerId }) => markerId === id) !== -1
      );
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
    /**
     * 清除高亮
     */
    onClearHighlightFeature(marker) {
      this.clearHighlightFeature(marker);
    },
    /**
     * 添加高亮
     */
    onHighlightFeature(marker) {
      this.zoomOrPanTo(marker.feature.bound);
      this.highlightFeature(marker);
    }
  }
};
</script>
