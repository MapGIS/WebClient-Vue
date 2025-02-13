<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";
import { IGSFeatureLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";

export default {
  name: "mapgis-3d-igs-dynamic-layer",
  mixins: [ServiceLayer],
  props: {
    gdbps: {
      type: [Array, String],
      require: true,
    },
  },
  data() {
    return {
      managerName: "IgsserverManager",
      providerName: "MapGISMapServerImageryProvider",
      checkType: {
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number",
      },
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    gdbps: {
      handler: function () {
        this.unmount();
        this.mount();
      },
    },
  },
  methods: {
    initUrl(service) {
      let _url;
      let { domain } = this;
      //优先判断url方式
      if (this.baseUrl) {
        const url = new URL(this.baseUrl);
        domain = url.origin;
      }
      if (domain) {
        _url = domain + service;
      } else {
        //最后ip方式
        if (this.ip && this.port) {
          _url = this.protocol + this.ip + ":" + this.port + service;
        } else {
          throw new Error("请输入url地址信息");
        }
      }

      return _url;
    },
    mount() {
      //处理独有参数
      const baseUrl = this.initUrl("/igs/rest/mrfs/layer");
      let { gdbps } = this;
      if (typeof gdbps === "string") {
        gdbps = gdbps.split(",");
      }
      const vm = this;
      const layer = new IGSFeatureLayer({
        url: baseUrl,
        gdbp: gdbps[0],
        renderMode: "server",
      });
      layer.load().then(() => {
        const cesiumOptions = initializeOptions(layer);
        const provider = new zondy.cesium.MapGISMapServerImageryProvider(
          cesiumOptions
        );
        vm.$_mount(provider, cesiumOptions);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
