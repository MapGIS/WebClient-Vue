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
      const baseUrl = this.$_initUrl("/igs/rest/mrms/docs/");
      this.$_mount({baseUrl:baseUrl});
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

