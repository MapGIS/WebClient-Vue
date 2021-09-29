<template>
  <div class="comprehensive-place-name-panel-container">
    <mapgis-ui-spin :spinning="spinning" v-if="!cluster">
      <template v-if="geojson.features.length > 0">
        <ul class="comprehensive-place-name-panel">
          <li
            v-for="(item, i) in geojson.features"
            :key="item.markerId"
            @mouseover="mouseOver(i)"
            @mouseleave="mouseLeave(i)"
            @click="setActivePoint(i)"
          >
            <div class="img-place-name-panel">
              <img :src="activeImage(item.properties.markerId)" />
            </div>
            <div class="content-place-name-panel">
              <p v-for="(config, index) in fieldConfigs" :key="index">
                <label>{{ config.title }}:</label>
                <span>{{ item.properties[config.name] }}</span>
              </p>
            </div>
          </li>
        </ul>
        <div class="pagination-container">
          <mapgis-ui-pagination
            simple
            :current="currentPageIndex"
            :total="maxCount"
            @change="pageChange"
            size="small"
          />
        </div>
      </template>
      <mapgis-ui-empty v-else />
    </mapgis-ui-spin>
    <mapgis-ui-spin :spinning="spinning" v-else>
      <div class="cluster-title">
        <span>
          聚合标注图层
        </span>
      </div>
      <div class="cluster-content">
        <span>
          {{ name }}
        </span>
        <span>
          {{ `共${setCounts()}条结果` }}
        </span>
        <mapgis-ui-tag :color="selectedItem.color">
          {{ selectedItem.color }}
        </mapgis-ui-tag>
      </div>
    </mapgis-ui-spin>
  </div>
</template>

<script>
const Feature = require("../util/feature");
import { Empty } from "ant-design-vue";
export default {
  props: {
    widgetInfo: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: ""
    },
    activeTab: {
      type: String,
      default: ""
    },
    keyword: {
      type: String,
      default: ""
    },
    cluster: {
      type: Boolean,
      default: false
    },
    baseUrl: {
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
    geometry: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fieldConfigs: [],
      fields: [],
      isDataStoreQuery: false,
      currentPageIndex: 1,
      maxCount: 0,
      markersInfos: [],
      activeMarkersInfos: [],
      activeFieldConfigs: [],
      spinning: false,
      geojson: { type: "FeatureCollection", features: [] },
      selectMarkers: []
    };
  },
  computed: {
    allItems() {
      return this.widgetInfo.placeName.queryTable;
    },
    config() {
      return this.widgetInfo.placeName || this.widgetInfo.dataStore;
    },
    selectedItem() {
      return this.allItems.find(item => this.name === item.placeName);
    }
  },
  watch: {
    cluster() {
      this.queryFeature();
    },
    activeTab: {
      immediate: true,
      handler() {
        this.selectMarkers = [];
        this.updataMarkers();
      }
    }
  },
  beforeCreate() {},
  mounted() {
    const { showAttrsAndTitle } = this.selectedItem;
    const fields = [];
    const configs = [];
    for (let j = 0; j < showAttrsAndTitle.length; j += 1) {
      const filed = showAttrsAndTitle[j].attr;
      fields.push(filed);
      configs.push({
        name: filed,
        title: showAttrsAndTitle[j].showName
      });
    }
    this.fieldConfigs = configs;
    this.fields = fields;
    this.queryFeature();
  },
  methods: {
    setCounts() {
      return this.config.clusterMaxCount < this.maxCount
        ? `大于${this.config.clusterMaxCount}`
        : `为${this.maxCount}`;
    },
    updataMarkers() {
      if (this.activeTab === this.name) {
        this.$emit("select-markers", this.selectMarkers);
        this.$emit("update-geojson", this.geojson);
      }
    },
    async queryFeature() {
      const where =
        this.keyword && this.keyword !== ""
          ? `${this.selectedItem.searchField ||
              this.config.allSearchName} LIKE '%${this.keyword}%'`
          : `${this.selectedItem.searchField ||
              this.config.allSearchName} LIKE '%'`;
      if (!this.isDataStoreQuery) {
        await this.igsQuery(where);
      } else {
        // await this.dsQuery(selectedItem, where, fields)
      }
    },
    /**
     * igs地名地址查询
     */
    async igsQuery(where) {
      const igsParams = {
        ip: this.config.ip,
        port: this.config.port,
        pageCount: this.cluster ? this.config.clusterMaxCount : 10,
        page: this.currentPageIndex - 1,
        fields: this.fields.toString(),
        rtnLabel: false,
        f: "json",
        where,
        geometry: this.geometry
      };
      const { queryWay } = this.config;
      if (queryWay === "doc") {
        // 地图文档
        igsParams.docName = this.config.docName;
        igsParams.layerName = this.selectedItem.LayerName;
        igsParams.layerIdxs = "";
      } else if (queryWay === "gdbp") {
        igsParams.gdbp = this.selectedItem.gdbp;
        igsParams.srsIds = "WGS1984_度";
      }
      const combine = this.config.combine === "true";
      this.spinning = true;
      try {
        const igsRes = await Feature.FeatureQuery.query(igsParams, combine);
        let data = igsRes;
        if (combine) {
          data = igsRes[0];
        }
        if (!data || !data.SFEleArray) {
          return;
        }
        const geoJSONData = Feature.FeatureConvert.featureIGSToFeatureGeoJSON(
          data
        );
        const { features } = geoJSONData;
        const markerCoords = [];
        if (!this.cluster) {
          for (let j = 0; j < features.length; j += 1) {
            const feature = features[j];
            const properties = {};
            for (let f = 0; f < this.fields.length; f += 1) {
              properties[this.fields[f]] = feature.properties[this.fields[f]];
            }
            properties.markerId = `place-name-${j}`;
            feature.properties = properties;
          }
        }
        this.geojson = { type: "FeatureCollection", features };
        this.maxCount = geoJSONData.dataCount
          ? geoJSONData.dataCount
          : features.length;
        this.updataMarkers();
      } catch (error) {
        console.log(error);
      } finally {
        this.spinning = false;
      }
    },
    mouseOver(index) {
      this.selectMarkers = [this.geojson.features[index].properties.markerId];
      this.updataMarkers();
    },
    mouseLeave(index) {
      this.selectMarkers = [];
      this.updataMarkers();
    },
            /**
     * 点击列表的回调事件
     */
    pageChange(page) {
      this.currentPageIndex = page;
      this.selectMarkers = [];
      this.queryFeature();
    },
        /**
     * 点击列表的回调事件
     */
    setActivePoint(index) {
      this.$emit("click-item", this.geojson.features[index]);
    },
    /**
     * 列表高亮图标
     */
    activeImage(markerId) {
      if (this.selectMarkers.length > 0 && this.selectMarkers[0] === markerId) {
        return this.selectedMarkerIcon;
      }
      return this.defaultMarkerIcon;
    }
  }
};
</script>
