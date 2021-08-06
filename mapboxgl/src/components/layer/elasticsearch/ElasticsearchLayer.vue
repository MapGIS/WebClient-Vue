<template>
  <div>
    <mapgis-heater-layer
      :geojson="geojson"
      v-bind="heaterOptions"
      v-if="mode == 'heater'"
    >
    </mapgis-heater-layer>

    <mapgis-cluster-layer
      :geojson="geojson"
      v-bind="clusterOptions"
      v-else-if="mode == 'cluster'"
      v-model="clusterfeature"
    >
      <mapgis-ui-border
        type="border5"
        class="mapgis-elasticsearch-custom-popup"
      >
        <mapgis-ui-row
          v-for="(f, i) in Object.keys(clusterfeature.properties)"
          :key="i"
          class="mapgis-custom-row"
        >
          <mapgis-ui-col :span="12">
            {{ f }}
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            {{ clusterfeature.properties[f] }}
          </mapgis-ui-col>
        </mapgis-ui-row>
      </mapgis-ui-border>
    </mapgis-cluster-layer>

  </div>
</template>

<script>
import { uuid } from "../../util/util";
import MapgisHeaterLayer from "../heater/HeaterLayer.vue";
import MapgisClusterLayer from "../cluster/ClusterLayer.vue";

export default {
  name: "mapgis-elasticsearch-layer",
  inject: ["mapbox", "map"],
  components: { MapgisHeaterLayer, MapgisClusterLayer },
  props: {
    buckets: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "heater" // heater  cluster
    },
    heaterOptions: {
      type: Object
    },
    clusterOptions: {
      type: Object
    }
  },
  data() {
    return {
      id: uuid(),
      geojson: {
        type: "FeatureCollection",
        features: []
      },
      clusterfeature: { coordinates: [0, 0], properties: { 属性名: "属性值" } }
    };
  },
  mounted() {
    this.$_deferredMount();
  },
  watch: {
    buckets: {
      handler(next) {
        this.parseBucket();
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.$_undeferredMount();
  },
  methods: {
    $_deferredMount() {},
    $_undeferredMount() {},
    $_bindEvent() {
      let { map } = this;
      map.on("click", function(e) {
        vm.$nextTick(() => {
          vm.updatePopup();
        });
      });
    },
    $_unbindEvent() {
      let { map } = this;
      map.off("click", function(e) {});
    },
    updateHeater() {},
    updateCluster() {},
    parseBucket(buckets) {
      buckets = buckets || this.buckets;
      let geojson = {
        type: "FeatureCollection",
        features: []
      };
      buckets.forEach(b => {
        let coords = [b.gridCentroid.location.lon, b.gridCentroid.location.lat];
        let feature = {
          type: "Feature",
          properties: {
            count: b.gridCentroid.count
          },
          geometry: {
            type: "Point",
            coordinates: coords
          }
        };
        geojson.features.push(feature);
      });
      this.geojson = geojson;
      return geojson;
    }
  }
};
</script>

<style>
.mapgis-elasticsearch-custom-popup {
  height: 200px;
}
</style>
