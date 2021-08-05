<template>
  <div>
    <slot :coordinates="coordinates" :properties="properties"></slot>
  </div>
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
    },
    uncluster: {
      type: Object,
      default: () => {
        return {
          paint: {
            "circle-color": "#000000",
            "circle-radius": 6,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
          }
        };
      }
    },
    feature: {
      coordinates: [0, 0],
      properties: { 属性名: "属性值" }
    }
  },
  data() {
    return {
      id: uuid(),
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
  watch: {
    coordinates: {
      handler(next) {},
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
        min,
        max,
        id,
        clusterMaxZoom,
        clusterRadius,
        uncluster,
        map
      } = this;
      let source = {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterMaxZoom: clusterMaxZoom, // 聚合最大级别
        clusterRadius: clusterRadius // 聚合半径
      };

      map.addSource(id, source);
      map.addLayer({
        id: id + "_cluster_circle",
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

      if (uncluster && uncluster.icon) {
        map.addLayer({
          id: id + "_uncluster_icon",
          type: "symbol",
          source: id,
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": uncluster.icon,
            "icon-size": 1
          }
        });
      } else {
        map.addLayer({
          id: id + "_uncluster_circle",
          type: "circle",
          source: id,
          filter: ["!", ["has", "point_count"]],
          paint: uncluster.paint
        });
      }

      this.$emit("added", {
        map,
        component: this,
        layerIds: [
          id + "_cluster_circle",
          id + "_label",
          id + "_uncluster_circle",
          id + "_uncluster_icon"
        ]
      });

      this.$_bindEvent();
    },
    $_undeferredMount() {
      let { map, id, uncluster } = this;
      map.removeLayer(id + "_cluster_circle");
      map.removeLayer(id + "_label");
      if (uncluster && uncluster.icon) {
        map.removeLayer(id + "_uncluster_icon");
      } else {
        map.removeLayer(id + "_uncluster_circle");
      }
      map.removeSource(id);
      this.$_unbindEvent();
    },
    $_bindEvent() {
      const vm = this;
      let { map, id } = this;
      let uncluster_circle = id + "_uncluster_circle";
      // let uncluster_icon = id + "_uncluster_icon";
      map.on("mouseenter", uncluster_circle, function(e) {
        if (!e.features || e.features.length <= 0) return;
        var coordinates = e.features[0].geometry.coordinates.slice();
        var properties = e.features[0].properties;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        /* let feature = e.features[0];
        feature.coordinates = coordinates; */
        vm.coordinates = coordinates;
        vm.properties = properties;

        vm.$emit("change-feature", {
          coordinates: coordinates,
          properties: properties
        });

        vm.$nextTick(() => {
          vm.updatePopup();
        });
      });
    },
    $_unbindEvent() {
      let { map, id } = this;
      let uncluster_circle = id + "_uncluster_circle";
      map.off("mouseenter", uncluster_circle, function(e) {});
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
