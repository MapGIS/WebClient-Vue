<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
import {
  Extent,
  TileInfo,
  SpatialReference,
  Point,
} from "@mapgis/webclient-common";
import { getTilingScheme } from "@mapgis/webclient-cesium-plugin";
export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "viewer"],
  mixins: [ServiceLayer],
  props: {
    wmtsLayer: { type: String, required: true },
    tileMatrixSet: { type: Object, required: true },
    wmtsStyle: { type: String, default: "default" },
    tilingScheme: { type: String, required: true },
    format: { type: String, default: "image/png" },
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        tileMatrixLabels: "array",
        clock: "object",
        times: "object",
        dimensions: "object",
        tileWidth: "number",
        tileHeight: "number",
        tilingScheme: "object",
        rectangle: "object",
        minimumLevel: "number",
        maximumLevel: "number",
        ellipsoid: "object",
        credit: "object|string",
        subdomains: "string|array",
        startLevel: "number",
        vueKey: "string",
        vueIndex: "number",
      },
      managerName: "OGCWMTSManager",
      providerName: "WebMapTileServiceImageryProvider",
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  computed: {
    watchList() {
      const { wmtsLayer, tileMatrixSet, tilingScheme, wmtsStyle } = this;
      return { wmtsLayer, tileMatrixSet, tilingScheme, wmtsStyle };
    },
  },
  watch: {
    watchList: {
      handler: function (next, old) {
        if (JSON.stringify(next) === JSON.stringify(old)) {
          return;
        }
        // 防止初始化的时候，图层被多次加载，图层未加载成功时，不执行
        const { vueIndex, vueKey } = this;
        const find = window.vueCesium[this.managerName].findSource(
          vueKey,
          vueIndex
        );
        if (!find) {
          return;
        }
        this.unmount();
        this.mount();
      },
      deep: true,
    },
  },
  methods: {
    mount() {
      let options = {};

      //处理独有参数
      //设置wmts服务的style
      options.style = this.wmtsStyle;

      //如果tilingScheme存在，则生成tilingScheme对象
      if (this.tileMatrixSet && this.tileMatrixSet.tileInfo) {
        const { tileInfo } = this.tileMatrixSet;
        const { fullExtent } = this.tileMatrixSet.layer.activeLayer;
        const { spatialReference } = tileInfo;
        const tileScheme = this.getCustomTilingScheme(
          tileInfo,
          spatialReference,
          fullExtent
        );
        options.tilingScheme = tileScheme;
      } else if (this.tilingScheme) {
        options.tilingScheme = this.$_setTilingScheme(this.tilingScheme);
      }

      //处理天地图的wmts
      let checkTileMatrixLabels = this.$_checkValue(
        this.options,
        "tileMatrixLabels",
        ""
      );
      if (
        checkTileMatrixLabels === "null" &&
        this.tilingScheme === "EPSG:4326"
      ) {
        if (this.baseUrl.indexOf("tianditu") > -1) {
          options.tileMatrixLabels = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
          ];
        }
      }

      //将wmtsLayer转为layer
      options.layer = this.wmtsLayer;

      //将tileMatrixSet转为tileMatrixSetID
      options.tileMatrixSetID = this.tileMatrixSet.id;

      this.$_mount(options);
    },

    // 根据tileInfo、spatialReference、extent，获取自定义TilingScheme对象
    getCustomTilingScheme(tileInfo, spatialReference, extent) {
      const spatialReferenceCommon = new SpatialReference({
        wkid: spatialReference.wkid,
      });
      const originCommon = new Point({
        coordinates: [tileInfo.origin.x, tileInfo.origin.y],
        spatialReference,
      });
      const extentCommon = new Extent({
        xmin: extent.xmin,
        ymin: extent.ymin,
        xmax: extent.xmax,
        ymax: extent.ymax,
      });
      const tileInfoCommon = new TileInfo({
        dpi: tileInfo.dpi,
        format: tileInfo.format,
        origin: originCommon,
        lods: tileInfo.lods,
        spatialReference: spatialReferenceCommon,
        size: tileInfo.size,
      });
      const tilingScheme = getTilingScheme(
        spatialReferenceCommon,
        extentCommon,
        tileInfoCommon
      );
      return tilingScheme;
    },
    unmount() {
      this.$_unmount();
    },
  },
};
</script>
