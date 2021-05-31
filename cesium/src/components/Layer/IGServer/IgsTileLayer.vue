<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-igs-tile-layer",
  mixins: [ServiceLayer],
  props: {
    srs: {
      type: String,
      default: "EPSG:4326"
    }
  },
  data() {
    return {
      managerName: "IgsTilecLayerManager",
      providerName: "MapGISMapProvider",
      checkType: {
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number"
      }
    };
  },
  mounted() {
    this.mount();
  },
  methods: {
    mount() {
      //处理独有参数
      const { srs } = this;
      let url = this.$_initUrl("/igs/rest/mrms/tile");
      url += "/{level}/{row}/{col}";
      let tilingScheme = this.$_setTilingScheme(srs);
      this.$_mount({ baseUrl: url, srs, tilingScheme });
    },
    unmount() {
      this.$_unmount();
    }
  },
  destroyed() {
    this.unmount();
  }
};
</script>
