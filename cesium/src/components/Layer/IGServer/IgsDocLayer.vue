<template>
  <span/>
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-igs-doc-layer",
  mixins: [ServiceLayer],
  props: {
    layers: {
      type: String,
      default: null
    },
    srs: {
      type: String,
      default: "EPSG:4326"
    }
  },
  watch: {
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    }
  },
  data(){
    return {
      managerName: "IgsDocLayerManager",
      providerName: "MapGIS2DDocMapProvider",
      checkType:{
        tileWidth:"number",
        tileHeight:"number",
        minimumLevel:"number",
        maximumLevel:"number"
      }
    }
  },
  mounted() {
    this.mount();
  },
  methods: {
    mount(){
      //处理独有参数
      let tilingScheme = this.$_setTilingScheme(this.srs);
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      this.$_mount({
        baseUrl:baseUrl,
        tilingScheme: tilingScheme
      });
    },
    unmount(){
      this.$_unmount();
    }
  },
  destroyed() {
    this.unmount();
  }

};
</script>

