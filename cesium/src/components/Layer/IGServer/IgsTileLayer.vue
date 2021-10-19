<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-igs-tile-layer",
  mixins: [ServiceLayer],
  props: {
    tilingScheme: {
      type: String,
      default: "EPSG:4326"
    }
  },
  data() {
    return {
      managerName: "IgsTilecLayerManager",
      providerName: "MapGISTileServerImageProvider",
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
      let url = this.$_initUrl("/igs/rest/mrms/tile");
      url += "/{level}/{row}/{col}";
      let tilingScheme = this.$_setTilingScheme(this.tilingScheme);
      this.$_mount({ baseUrl: url, srs : this.tilingScheme, tilingScheme });
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
