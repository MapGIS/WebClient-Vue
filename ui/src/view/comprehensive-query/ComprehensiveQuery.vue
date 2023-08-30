<template>
  <div
    class="mp-widget-comprehensive-query"
    :style="{ width: decode ? '400px' : '300px' }"
  >
    <div class="search-box query-section">
      <div class="comprehensive-query-logo" @click="onLocate">
        <mapgis-ui-icon :icon="logo" />
        <span class="district-title">{{ districtName }}</span>
      </div>
      <mapgis-ui-divider type="vertical" />
      <mapgis-ui-button
        v-if="!searchInputExapnd"
        class="start-search-button"
        icon="search"
        @click="onStartSearch"
      />
      <template v-else>
        <mapgis-ui-input
          class="search-input"
          placeholder="请输入关键字"
          v-model="keyword"
          allow-clear
          @focus="onSearchFocus"
          @pressEnter="onSearch"
          v-if="!decode"
        />
        <div v-else style="display:flex;max-width:276px">
          <mapgis-ui-input
            placeholder="经度"
            allow-clear
            v-model="lon"
            @focus="onSearchFocus"
          ></mapgis-ui-input>
          <mapgis-ui-input
            placeholder="纬度"
            allow-clear
            v-model="lat"
            @focus="onSearchFocus"
          ></mapgis-ui-input>
          <mapgis-ui-input
            placeholder="半径"
            allow-clear
            v-model="dis"
            @focus="onSearchFocus"
          ></mapgis-ui-input>
        </div>
        <mapgis-ui-divider type="vertical" />
        <mapgis-ui-button class="close-button" icon="close" @click="onClose" />
        <mapgis-ui-button
          class="search-button"
          type="primary"
          icon="search"
          @click="onSearch"
        />
      </template>
    </div>
    <div
      :class="['locate-panel-contaner']"
      :style="{ display: locationPanelExpand ? 'block' : 'none' }"
    >
      <slot />
    </div>
    <div id="measure-max-height" />
    <div
      :class="[
        'search-panel-contaner',
        'panel-container',
        'query-section',
        searchPanelExpand ? '' : 'unvisible'
      ]"
      :style="{ 'max-height': `${maxHeight}px` }"
    >
      <place-name
        ref="placeName"
        :defaultMarkerIcon="defaultMarkerIcon"
        :selectedMarkerIcon="selectedMarkerIcon"
        :widgetInfo="widgetInfo"
        :geometry="geometry"
        :geoJSONExtent="geoJSONExtent"
        :decode="decode"
        :lon="lon"
        :lat="lat"
        :dis="dis"
        :is2DMapMode="is2DMapMode"
        :searchPanelExpand="searchPanelExpand"
        :selectShowProperty="selectShowProperty"
        @change-decode="decodeChange"
        @current-result="currentResult"
        @select-markers="selectMarkers"
        @click-item="clickItem"
        @change-cluster="changeCluster"
        @open-attribute-table="openAttributeTable"
        @color-cluster="colorCluster"
        @remove-attribute-table="removeAttributeTable"
        @select-item="selectItem"
        @picked-coordinate="onPickedCoordinate"
      ></place-name>
    </div>
  </div>
</template>

<script>
import * as Feature from "./util/feature";
import PlaceName from "./PlaceName/PlaceName.vue";
import { Style } from "@mapgis/webclient-es6-service";
import circleTurf from "@turf/circle";

const { LineStyle, PointStyle, FillStyle } = Style;

export default {
  name: "mapgis-ui-comprehensive-query",
  components: {
    PlaceName
  },
  inject: ["Cesium", "viewer", "map"],
  props: {
    logo: {
      type: String,
      default: ""
    },
    defaultMarkerIcon: {
      type: String,
      default: ""
    },
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
    },
    selectShowProperty: {
      type: Array,
      default: () => []
    },
    highlightStyle: {
      type: Object,
      default: () => ({})
    },
    is2DMapMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: "",

      searchPanelExpand: false,

      maxHeight: 0,

      locationPanelExpand: false,

      searchInputExapnd: false,

      decode: false, // 是否开启逆地址解析

      lon: "", //逆地址解析的经度

      lat: "", // 逆地址解析的纬度

      dis: 10 // 逆地址解析的半径
    };
  },
  watch: {
    lon() {
      this.featureChange();
    },
    lat() {
      this.featureChange();
    },
    dis() {
      this.featureChange();
    },
    is2DMapMode() {
      this.lon = "";
      this.lat = "";
      // 默认的半径为数字10，如果是默认半径则不清除，修改半径以后dis类型会变成string，则清除
      if (typeof this.dis !== "number") {
        this.dis = "";
      }
    }
  },
  computed: {
    isDataStoreQuery() {
      return !!this.widgetInfo.dataStore;
    },
    geometry() {
      if (this.geoJSONExtent && JSON.stringify(this.geoJSONExtent) !== "{}") {
        let geojson;
        if (this.geoJSONExtent.features) {
          geojson = this.geoJSONExtent;
        } else {
          geojson = {
            type: "FeatureCollection",
            features: [this.geoJSONExtent]
          };
        }
        const result = Feature.FeatureConvert.featureGeoJSONToTangram(geojson);
        if (Array.isArray(result)) return result[0];
        return result;
      }
      return null;
    }
  },
  mounted() {
    this.setMaxHeight();
    window.addEventListener("resize", this.setMaxHeight, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.setMaxHeight, false);
  },
  methods: {
    // 清除绘制的圆形区域
    clearFeature() {
      if (this.map.getLayer("comprehensiveQueryCircle_Layer")) {
        this.map.removeLayer("comprehensiveQueryCircle_Layer");
      }
      if (this.map.getSource("comprehensiveQueryCircle")) {
        this.map.removeSource("comprehensiveQueryCircle");
      }
      this.circle && this.viewer.entities.remove(this.circle);
      this.circleLine && this.viewer.entities.remove(this.circleLine);
    },
    // 绘制圆形
    featureChange() {
      if (this.lon && this.lat && this.dis) {
        if (this.is2DMapMode) {
          this.featureChange2D();
        } else {
          this.featureChange3D();
        }
      } else {
        this.clearFeature();
      }
    },
    // 绘制二维圆形
    featureChange2D() {
      // 先清除再绘制
      if (this.map.getLayer("comprehensiveQueryCircle_Layer")) {
        this.map.removeLayer("comprehensiveQueryCircle_Layer");
      }
      if (this.map.getSource("comprehensiveQueryCircle")) {
        this.map.removeSource("comprehensiveQueryCircle");
      }
      const center = [this.lon, this.lat];
      const radius = this.dis;
      const options = {
        steps: 64,
        units: "kilometers",
        properties: { foo: "bar" }
      };
      const circle = circleTurf(center, radius, options);
      const fillStyle = new FillStyle({
        color: this.highlightStyle.feature.reg.color,
        outlineColor: this.highlightStyle.feature.line.color
      });
      this.map.addSource("comprehensiveQueryCircle", {
        type: "geojson",
        data: circle
      });
      this.map.addLayer({
        id: "comprehensiveQueryCircle_Layer",
        type: "fill",
        source: "comprehensiveQueryCircle",
        ...fillStyle.toMapboxStyle()
      });
    },
    // 绘制三维圆形
    featureChange3D() {
      this.circleLine && this.viewer.entities.remove(this.circleLine);
      this.circle && this.viewer.entities.remove(this.circle);
      const fillColor = new this.Cesium.Color.fromCssColorString(
        this.highlightStyle.feature.reg.color
      ).withAlpha(0.5);
      const outlineColor = new this.Cesium.Color.fromCssColorString(
        this.highlightStyle.feature.line.color
      );
      const outlineWidth = Number(this.highlightStyle.feature.line.size);
      this.circle = this.viewer.entities.add({
        id: "comprehensiveQueryCircle",
        position: Cesium.Cartesian3.fromDegrees(
          Number(this.lon),
          Number(this.lat),
          0
        ),
        ellipse: {
          semiMinorAxis: Number(this.dis) * 1000, // 半短轴
          semiMajorAxis: Number(this.dis) * 1000, // 半长轴
          material: fillColor,
          clampToGround: true
        }
      });
      const center = [this.lon, this.lat];
      const radius = this.dis;
      const options = {
        steps: 64,
        units: "kilometers",
        properties: { foo: "bar" }
      };
      const circle = circleTurf(center, radius, options);
      this.circleLine = this.viewer.entities.add({
        id: "comprehensiveQueryCircleLine",
        polyline: {
          positions: new this.Cesium.Cartesian3.fromDegreesArray(
            circle.geometry.coordinates[0]
              .join(",")
              .split(",")
              .map(Number)
          ),
          width: outlineWidth,
          material: outlineColor,
          clampToGround: true
        }
      });
    },

    onPickedCoordinate(lon, lat) {
      this.lon = lon;
      this.lat = lat;
    },
    decodeChange(e) {
      this.decode = e;
      if (e) {
        this.$message.info("点击地图可进行鼠标拾取");
      } else {
        this.clearFeature();
        this.$message.info("鼠标拾取已关闭");
      }
    },
    onLocate() {
      this.locationPanelExpand = !this.locationPanelExpand;
      this.searchPanelExpand = false;
    },
    onClose() {
      if (!this.locationPanelExpand && !this.searchPanelExpand) {
        this.searchInputExapnd = false;
        this.$emit("close-popup");
        return;
      }
      this.clearFeature();
      this.lon = "";
      this.lat = "";
      this.dis = "";

      this.locationPanelExpand = false;
      this.searchPanelExpand = false;
      this.$refs.placeName.removeResult();
      this.$refs.placeName.reset();
      this.$emit("onClose");
    },
    colorCluster(color) {
      this.$emit("color-cluster", color);
    },
    onSearchFocus() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
    },
    onSearch() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
      /**
       * 点击搜索的回调函数
       * @isDataStoreQuery 当前查询是否走的是大数据查询
       * @keyword 当前查询关键字，当为大数据查询并且关键字为空时，这里会进行逆地理编码查询
       *          采用当前视窗的中心点和视窗宽度的一半来进行逆地理编码查询
       */
      this.$emit("onSearch", this.isDataStoreQuery, this.keyword);
      this.$nextTick(() => {
        this.$refs.placeName.search(this.keyword);
      });
    },
    onStartSearch() {
      this.searchInputExapnd = true;
    },
    setMaxHeight() {
      const top = document
        .getElementById("measure-max-height")
        .getBoundingClientRect().top;
      const bottom = document.documentElement.clientHeight - top;
      this.maxHeight = bottom - 10 - 3;
    },
    /**
     * 当前展示的结果回调函数
     */
    currentResult(geojson) {
      this.$emit("current-result", geojson);
    },
    /**
     * 当前点击的条目的回调函数
     */
    clickItem(feature) {
      this.$emit("click-item", feature);
    },
    /**
     * 当前选中的坐标
     */
    selectMarkers(selectMarkers) {
      this.$emit("select-markers", selectMarkers);
    },
    /**
     * 聚合按钮改变时的回调
     */
    changeCluster(val) {
      this.$emit("change-cluster", val);
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
    },
    selectItem(data) {
      this.$emit("select-item", data);
    }
  }
};
</script>
