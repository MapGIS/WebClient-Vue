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
      :class="[
        'locate-panel-contaner',
        'query-section',
        'panel-container',
        locationPanelExpand ? '' : 'unvisible'
      ]"
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
      ></place-name>
    </div>
  </div>
</template>

<script>
const Feature = require("./util/feature");
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
        return;
      }

      this.locationPanelExpand = false;
      this.searchPanelExpand = false;
      this.$refs.placeName.removeResult();
      this.$refs.placeName.reset();
      this.$emit("onClose");
    },
    onSearchFocus() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
    },
    onSearch() {
      this.searchPanelExpand = true;
      this.locationPanelExpand = false;
      this.$emit("onSearch");
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
    }
  }
};
</script>
