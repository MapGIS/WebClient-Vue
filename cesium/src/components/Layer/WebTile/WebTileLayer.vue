<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-web-tile-layer",
  inject: ["Cesium", "viewer", "vueCesium"],
  mixins: [ServiceLayer],
  props: {
    // 子域名集
    subDomains: {
      type: Array,
      default: () => [],
    },
    spatialReference: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        rectangle: "object",
        tilingScheme: "object",
        ellipsoid: "object",
        tileWidth: "number",
        tileHeight: "number",
        maximumLevel: "number",
        credit: "object|String",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      managerName: "WebTileManager",
      providerName: "UrlTemplateImageryProvider",
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    mount() {
      let { baseUrl } = this;
      const options = {};
      //如果spatialReference存在，则生成tilingScheme对象
      if (this.$props.spatialReference) {
        // 构造CustomTilingScheme
        options.tilingScheme = this.$_setTilingScheme(
          this.$props.spatialReference.wkid
        );
      }
      // 标准的4326缺裁图方式，第0级分辨率0.7031249999891483,天地图服务第0级为1.4062499999782967
      let zoomOffset =
        this.$props.options.zoomOffset ||
        (this.$props.spatialReference?.wkid === 4326 &&
          baseUrl.includes("tianditu"))
          ? -1
          : 0;
      let tag;
      if (baseUrl.includes("{") && baseUrl.includes("}/")) {
        const urlStrs = baseUrl.split("{");
        tag = urlStrs[1].split("}/")[0];
      }
      // 如果存在tag,或者zoomOffset不为空且不为0(即只有存在级别偏移的时候),则走customTags的方式
      if (tag || zoomOffset) {
        if (baseUrl.includes("{z}")) {
          tag = "sz";
          baseUrl = baseUrl.replace("{z}", "{sz}");
        }
        options.customTags = {};
        options.customTags[tag] = function (imageryProvider, x, y, level) {
          return level - zoomOffset;
        };
      }

      // 支持子域名模式，统一子域名关键字
      const subDomainKeys = ["{s}", "{subDomain}", "{subDomains}"];
      subDomainKeys.forEach((key) => {
        if (baseUrl && baseUrl.includes(key)) {
          baseUrl = baseUrl.replace(key, "{s}");
        }
      });

      // 把format的值放到options.extensions中，cesium接口中需要这么设置
      let tempBaseUrl = baseUrl;
      if (baseUrl.includes("format=")) {
        const urlStrs = baseUrl.split("format=");
        const strChilds = urlStrs[1].split("&");
        if (
          options.hasOwnProperty("extensions") &&
          options.extensions.length > 0
        ) {
          options.extensions.push({
            key: "format",
            value: strChilds[0],
          });
        } else {
          options.extensions = [{ key: "format", value: strChilds[0] }];
        }
        tempBaseUrl = urlStrs[0] + strChilds[1];
      }

      const allOptions = { ...options, baseUrl: tempBaseUrl, url: tempBaseUrl };

      if (this.subDomains && this.subDomains.length > 0) {
        allOptions.subdomains = this.subDomains;
      }
      let rectangle = undefined;
      if (this.options.rectangle) {
        const { xmin, ymin, xmax, ymax } = this.options.rectangle;
        const west = (xmin * Math.PI) / 180;
        const south = (ymin * Math.PI) / 180;
        const east = (xmax * Math.PI) / 180;
        const north = (ymax * Math.PI) / 180;
        rectangle = new this.Cesium.Rectangle(west, south, east, north);
      }
      allOptions.rectangle = rectangle;
      if (this.options?.extensions) {
        allOptions = { ...allOptions, ...this.options?.extensions };
      }
      this.$_mount(allOptions);
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
