<template>
  <span/>
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-arcgis-tile-layer",
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
      this.$_mount();
    },
    unmount() {
      this.$_unmount();
    }
  }
}
</script>

<style scoped>

</style>