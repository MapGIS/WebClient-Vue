<template>
  <div>
    <mapgis-ui-comprehensive-query
      :geoJSONExtent="geoJSONExtent"
      :logo="logo"
      :districtName="districtName"
      :widgetInfo="widgetInfo"
      :defaultMarkerIcon="defaultMarkerIcon"
      :selectedMarkerIcon="selectedMarkerIcon"
      @onClose="onClose"
      @onSearch="onSearch"
      @current-result="currentResult"
      @select-markers="selectMarkers"
      @click-item="clickItem"
      @change-cluster="changeCluster"
      @open-attribute-table="openAttributeTable"
      @remove-attribute-table="removeAttributeTable"
      @color-cluster="setColorCluster"
    >
    </mapgis-ui-comprehensive-query>
    <place-name-mapbox
      :defaultMarkerIcon="defaultMarkerIcon"
      :selectedMarkerIcon="selectedMarkerIcon"
      :hoverMarker="hoverMarker"
      :cluster="cluster"
      :geojson="current"
      :colorCluster="colorCluster"
    />
  </div>
</template>

<script>
import * as Feature from "./util/feature";
import PlaceNameMapbox from "./PlaceNameMapbox";

export default {
  name: "mapgis-2d-comprehensive-query",
  components: { PlaceNameMapbox },
  inject: ["mapbox", "map"],
  props: {
    logo: {
      type: String,
      default: ""
    },
    /**
     * 默认图标
     */
    defaultMarkerIcon: {
      type: String,
      default: ""
    },
    /**
     * 选中图标
     */
    selectedMarkerIcon: {
      type: String,
      default: ""
    },
    districtName: {
      type: String,
      default: ""
    },
    geoJSONExtent: {
      type: Object,
      default: () => ({})
    },
    widgetInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      /**
       * 是否开启聚合标注
       */
      cluster: false,
      colorCluster: "",
      /**
       * 查询的结果
       */
      current: { type: "FeatureCollection", features: [] },
      /**
       * 鼠标移入的marker
       */
      hoverMarker: [],
      /**
       * 行政区范围
       */
      district: null
    };
  },
  methods: {
    /**
     * 点击关闭的回调函数
     */
    onClose() {
      this.$emit("onClose");
    },
    /**
     * 查询时的回调函数（在没有查询范围时，采用当前屏幕的范围）
     */
    onSearch() {
      this.$emit("onSearch");
    },
    /**
     * 设置聚合图标的颜色
     */
    setColorCluster(color) {
      this.colorCluster = color;
    },
    /**
     * 当前展示的结果回调函数（将查询结果展示至地图上）
     */
    currentResult(geojson) {
      this.current = geojson;
    },
    /**
     * 当前点击的条目的回调函数（实现点击后跳转中心点）
     */
    clickItem(feature) {
      const center = Feature.getGeoJSONFeatureCenter(feature);
      this.map.flyTo({
        center: center,
        curve: 1,
        easing(t) {
          return t;
        }
      });
    },

    /**
     * 当前选中的坐标
     */
    selectMarkers(selectMarkers) {
      this.hoverMarker = selectMarkers;
    },

    /**
     * 聚合按钮改变时的回调
     */
    changeCluster(val) {
      this.current = { type: "FeatureCollection", features: [] };
      this.cluster = val;
    },

    /**
     * 打开属性表回调函数
     */
    openAttributeTable(exhibition) {
      this.$emit("open-attribute-table", exhibition);
    },

    /**
     * 关闭属性表回调函数
     */
    removeAttributeTable(exhibitionId) {
      this.$emit("remove-attribute-table", exhibitionId);
    }
  }
};
</script>
