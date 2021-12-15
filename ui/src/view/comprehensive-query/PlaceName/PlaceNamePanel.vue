<template>
  <div class="comprehensive-place-name-panel-container">
    <mapgis-ui-spin :spinning="spinning" v-if="!cluster">
      <template v-if="geojson.features.length > 0">
        <ul class="comprehensive-place-name-panel">
          <li
            v-for="(item, i) in geojson.features"
            :key="item.properties.markerId"
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
import * as Feature from "../util/feature";
import { Empty } from "ant-design-vue";
import * as turf from "@turf/turf";
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
    },
    /**
     * dataStore多边形查询范围
     */
    geoJSONExtent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fieldConfigs: [],
      fields: [],
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
      return this.config.queryTable;
    },
    isDataStoreQuery() {
      return !!this.widgetInfo.dataStore;
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
    /**
     * 聚合展示时，面板展示内容
     */
    setCounts() {
      return this.config.clusterMaxCount < this.maxCount
        ? `大于${this.config.clusterMaxCount}`
        : `为${this.maxCount}`;
    },
    /**
     * 通知外层组件更新标注点信息
     */
    updataMarkers() {
      if (this.activeTab === this.name) {
        this.$emit("select-markers", this.selectMarkers);
        this.$emit("update-geojson", this.geojson);
        this.$emit("color-cluster", this.selectedItem.color);
      }
    },
    async queryFeature() {
      if (!this.isDataStoreQuery) {
        const where =
          this.keyword && this.keyword !== ""
            ? `${this.selectedItem.searchField ||
                this.config.allSearchName} LIKE '%${this.keyword}%'`
            : `${this.selectedItem.searchField ||
                this.config.allSearchName} LIKE '%'`;
        await this.igsQuery(where);
      } else {
        const where = this.keyword;
        await this.dsQuery(where);
      }
    },
    /**
     * 当为dataStore查询时并且keyword为空，采用逆地理编码查询，获取中心点与查询范围
     */
    getLonLatDis() {
      if (this.geoJSONExtent && JSON.stringify(this.geoJSONExtent) !== "{}") {
        const { geometry } = this.geoJSONExtent;
        const { coordinates } = geometry;
        const from = turf.point(coordinates[0][0]);
        const to = turf.point(coordinates[0][3]);
        const options = { units: "kilometers" };

        const distance = turf.rhumbDistance(from, to, options);

        const center = turf.centerOfMass(this.geoJSONExtent);
        return {
          lon: center.geometry.coordinates[0],
          lat: center.geometry.coordinates[1],
          dis: distance / 2
        };
      }
      return {};
    },
    /**
     * dataStore查询，根据this.widgetInfo.dataStore该字段判断
     */
    async dsQuery(where) {
      const { queryWay } = this.config;
      let libName = this.selectedItem.mLibsName;
      let lon;
      let lat;
      let dis;
      if (this.isDataStoreQuery && !this.keyword) {
        const lonLatDis = this.getLonLatDis();
        lon = lonLatDis.lon;
        lat = lonLatDis.lat;
        dis = lonLatDis.dis;
      }
      const datastoreParams = {
        ip: this.config.ip,
        port: this.config.port,
        pageCount: 10,
        page: this.currentPageIndex,
        where,
        geometry:
          this.geoJSONExtent &&
          JSON.stringify(this.geoJSONExtent) !== "{}" &&
          this.keyword
            ? JSON.stringify(this.geoJSONExtent)
            : undefined,
        libName,
        decode: !this.keyword,
        lon,
        lat,
        dis,
        isEsGeoCode: true
      };
      try {
        const geoCode = await Feature.FeatureQuery.query(datastoreParams);
        if (geoCode) {
          const features = geoCode.result;
          const markerCoords = [];
          for (let j = 0; j < features.length; j += 1) {
            const feature = features[j];
            const coordinates = [feature.lon, feature.lat];
            const properties = {};
            if (!this.cluster) {
              for (let f = 0; f < this.fields.length; f += 1) {
                const allProperties = {
                  ...feature.detail,
                  ...feature.areaAddr,
                  ...feature
                };
                const field = this.fields[f];
                properties[field] = allProperties[field];
              }
            }
            properties.markerId = `place-name-${j}`;
            markerCoords.push({
              type: "Feature",
              properties,
              geometry: {
                type: "Point",
                coordinates
              }
            });
          }
          this.geojson = { type: "FeatureCollection", features: markerCoords };
          this.maxCount = geoCode.totalCount
            ? geoCode.totalCount
            : features.length;
          this.updataMarkers();
        }
      } catch (error) {
        console.log(error);
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
