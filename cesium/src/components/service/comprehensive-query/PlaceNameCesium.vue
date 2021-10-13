<template>
  <div>
    <mapgis-3d-dynamic-marker-layer
      v-if="!cluster"
      :data="geojson"
      :selects="hoverMarker"
      :highlight="false"
      :layerStyle="layerStyle"
      :highlightStyle="highlightStyle"
      idField="markerId"
    />
    <!-- 聚合标注专题图 -->
    <mapgis-3d-mapv-layer
      v-else-if="
        geojson &&
          geojson.features &&
          geojson.features.length > 0 &&
          colorCluster
      "
      :geojson="geojson"
      :options="options"
      count-field="count"
    />
  </div>
</template>

<script>
import { Style } from "@mapgis/webclient-es6-service";
const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;
export default {
  name: "place-name-cesium",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  props: {
    selectedMarkerIcon: {
      type: String,
      default: ""
    },
    defaultMarkerIcon: {
      type: String,
      default: ""
    },
    cluster: {
      type: Boolean,
      default: false
    },
    colorCluster: {
      type: String,
      default: ""
    },
    geojson: {
      type: Object,
      default: () => ({})
    },
    hoverMarker: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    layerStyle() {
      return new MarkerStyle({
          symbol: this.defaultMarkerIcon
        });
    },
    highlightStyle() {
      return {
        enableHoverMarker: false,
        enableHoverFeature: false,
        marker: new MarkerStyle({
          symbol: this.selectedMarkerIcon
        }),
        point: new PointStyle(),
        line: new LineStyle(),
        polygon: new FillStyle()
      };
    },
    options() {
      return {
        fillStyle: this.colorCluster,
        size: 50 / 3 / 2, // 非聚合点的半径
        minSize: 8, // 聚合点最小半径
        maxSize: 31, // 聚合点最大半径
        globalAlpha: 0.8, // 透明度
        clusterRadius: 150, // 聚合像素半径
        maxClusterZoom: 18, // 最大聚合的级别
        maxZoom: 19, // 最大显示级别
        minPoints: 5, // 最少聚合点数，点数多于此值才会被聚合
        extent: 400, // 聚合的细腻程度，越高聚合后点越密集
        label: {
          // 聚合文本样式
          show: true, // 是否显示
          fillStyle: "white"
        },
        gradient: { 0: "blue", 0.5: "yellow", 1.0: "rgb(255,0,0)" }, // 聚合图标渐变色
        cesium: { postRender: true, postRenderFrame: 0 },
        draw: "cluster",
        context: "2d"
      };
    }
  }
};
</script>
