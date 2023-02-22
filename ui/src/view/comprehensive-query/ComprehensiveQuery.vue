<template>
  <div class="mp-widget-comprehensive-query">
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
        />
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
        @current-result="currentResult"
        @select-markers="selectMarkers"
        @click-item="clickItem"
        @change-cluster="changeCluster"
        @open-attribute-table="openAttributeTable"
        @color-cluster="colorCluster"
        @remove-attribute-table="removeAttributeTable"
        @select-item="selectItem"
      ></place-name>
    </div>
  </div>
</template>

<script>
import * as Feature from "./util/feature";
import PlaceName from "./PlaceName/PlaceName.vue";

export default {
  name: "mapgis-ui-comprehensive-query",
  components: {
    PlaceName
  },
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
    }
  },
  data() {
    return {
      keyword: "",

      searchPanelExpand: false,

      maxHeight: 0,

      locationPanelExpand: false,

      searchInputExapnd: false
    };
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
