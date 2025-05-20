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
      // 判断是否有tokne信息
      const queryGdbp = gdbps[0];
      const param = queryGdbp.split("&");
      const options = {
        url: baseUrl,
        gdbp: param[0],
        renderMode: "server",
      };

      if (param.length > 1) {
        const tokenInfo = param[1].split("=");
        options.tokenKey = tokenInfo[0];
        options.tokenValue = tokenInfo[1];
      }

      const vm = this;
      const layer = new IGSFeatureLayer(options);
      layer.load().then(() => {
        const cesiumOptions = initializeOptions(layer);
        vm.$_mount(cesiumOptions);
      });
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
