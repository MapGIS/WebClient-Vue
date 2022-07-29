<template>
  <span/>
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
  props: {
    srs: {
      type: String,
      default: "EPSG:4326"
    },
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      managerName: "ArcgisManager",
      providerName: "ArcGisMapServerImageryProvider",
    }
  },
  inject: ["Cesium", "vueCesium"],
  mixins: [ServiceLayer],
  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      let options = {};
      options.tilingScheme = this.$_setTilingScheme(this.srs);
      this.$_mount(options);
    },
    unmount() {
      this.$_unmount();
    }
  }
}
</script>

<style scoped>

</style>