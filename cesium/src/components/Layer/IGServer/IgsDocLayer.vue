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
      providerName: "MapGISMapServerImageryProvider",
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
      let tilingScheme = this.$_setTilingScheme(this.srs),extensions = [];
      if (
          this.srs === "EPSG:4326" ||
          this.srs === "EPSG:4490" ||
          this.srs === "EPSG:4610" ||
          this.srs === "EPSG:4214"
      ) {
        extensions = [
          { key: 'proj', value: 'WGS1984_度' }
        ]
      } else if (this.srs === "EPSG:3857") {
        extensions = [
          { key: 'proj', value: 'Web墨卡托_WGS1984' }
        ]
      }
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      this.$_mount({
        baseUrl:baseUrl,
        tilingScheme: tilingScheme,
        extensions: extensions
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

