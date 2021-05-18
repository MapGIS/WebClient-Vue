<template>
  <span />
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-geojson-datasource",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    ...VueOptions,
    url: {
      type: [String, Object],
      required: true
    },
    options: {
      type: Object,
      default: () => {
        return {
          markerSize: 48,
          strokeWidth: 2,
          clampToGround: true
        };
      }
    }
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { url, options } = this;
      return new Cesium.GeoJsonDataSource.load(url, options);
    },
    mount() {
      const { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function(dataSource) {
        // viewer.zoomTo(dataSource);
        viewer.dataSources.add(dataSource);
        vm.$emit("load", { component: this });
        CesiumZondy.GeojsonManager.addSource(vueKey, vueIndex, dataSource, {});
      });
    },
    unmount() {
      let { webGlobe, CesiumZondy, vueKey, vueIndex } = this;
      const { viewer } = webGlobe;
      const { dataSources } = viewer;
      let find = CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      if (find) {
        if (dataSources) {
          dataSources.remove(find.source, true);
        }
      }
      CesiumZondy.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    }
  }
};
</script>
