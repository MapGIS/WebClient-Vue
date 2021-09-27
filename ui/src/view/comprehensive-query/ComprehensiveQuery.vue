<template>
  <div class="mp-widget-comprehensive-query">
    <div class="search-box query-section">
      <div class="comprehensive-query-logo" @click="onLocate">
        <mapgis-ui-icon :icon="logo" />
        <span class="district-title" v-if="districtName">{{
          districtName
        }}</span>
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
      :class="[
        'locate-panel-contaner',
        'query-section',
        'panel-container',
        locationPanelExpand ? '' : 'unvisible'
      ]"
    >
      <mapgis-ui-tabs v-model="locationType" size="small" type="card">
        <mapgis-ui-tab-pane
          key="district"
          tab="行政区划定位"
        ></mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane
          key="coordinate"
          tab="坐标定位"
          force-render
        ></mapgis-ui-tab-pane>
        <mapgis-ui-tab-pane key="map-sheet" tab="图幅定位"></mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
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
        :widgetInfo="widgetInfo"
        :geometry="geometry"
      ></place-name>
    </div>
  </div>
</template>

<script>
import Feature from "./util/feature";
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
    districtName: {
      type: String,
      default: ""
    },
    widgetInfo: {
      type: Object,
      default: () => ({
        placeName: {
          ip: "192.168.21.191",
          port: "6163",
          combine: "true",
          queryWay: "gdbp",
          docName: "",
          showType: "normal",
          clusterMaxCount: "1000",
          allSearchName: "NAME",
          allShows: "NAME:名称,ADDRESS:地址,TELEPHONE:联系方式,PAC:邮政编码",
          queryTable: []
        }
      })
    }
  },
  data() {
    return {
      keyword: "",

      searchPanelExpand: false,

      maxHeight: 0,

      // 可选district：行政区划定位；coordinate：坐标定位；map-sheet：图幅号定位
      locationType: "",

      locationPanelExpand: false,

      searchInputExapnd: false,

      geoJson: null
    };
  },
  computed: {},
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
        return;
      }

      this.locationPanelExpand = false;
      this.searchPanelExpand = false;
    },
    onSearchFocus() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
    },
    onSearch() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
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
    }
  }
};
</script>
