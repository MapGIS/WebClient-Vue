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
        <span> 聚合标注图层 </span>
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
import { point } from "@turf/helpers";
import midpoint from "@turf/midpoint";
import booleanEqual from "@turf/boolean-equal";
import rhumbDistance from "@turf/rhumb-distance";
import centerOfMass from "@turf/center-of-mass";

// 默认展示字段，管理平台无配置时展示
const fieldConfigs = [
  {
    fieldName: "zd_name",
    showName: "名称"
  },
  {
    fieldName: "zd_address",
    showName: "地址"
  },
  {
    fieldName: "geometry",
    showName: "地理经纬度"
  }
];
// 查询字段映射（管理平台与前台字段不一致）
const fieldsMap = {
  zd_marker: "marker",
  zd_addr_code: "code",
  zd_country: "country",
  zd_street_no: "streetNo",
  zd_city: "city",
  zd_town: "town",
  zd_name: "name",
  zd_village: "village",
  zd_street: "street",
  zd_interest_point: "interestpoint",
  zd_province: "province",
  zd_nation: "nation",
  geometry: "geometry",
  zd_address: "formatAddress",
  zd_idetifier: "identifier"
};
export default {
  inject: ["Cesium", "viewer"],
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
    },
    decode: {
      type: Boolean,
      default: false
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
    let { showField } = this.selectedItem;
    if (showField.length <= 0) {
      showField = this.config.defaultShowField;
      if (this.config.defaultShowField <= 0) {
        showField = fieldConfigs;
      }
    }

    const fields = [];
    const configs = [];
    for (let j = 0; j < showField.length; j += 1) {
      const filed = showField[j].fieldName;
      fields.push(fieldsMap[filed]);
      configs.push({
        name: fieldsMap[filed],
        title: showField[j].showName
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
        let from = centerOfMass(this.geoJSONExtent);
        /**  三维情况下、当视角缩放到可以看见球的边界时，获取到的geoJSONExtent查询范围是[-180,90],[180,90],[180,-90],[-180,-90],[-180,90]
         此时使用centerOfMass计算出的中心点为[0，0],因此在datastore逆地址查询时会以[0,0]为经纬度加上计算出的半径进行查询，导致如果查询数据不在这个范围内就查询不到
         这种情况下重新取视图的像素中心点再转换成经纬度中心点
         */
        if (booleanEqual(from, point([0, 0]))) {
          from = point(this.get3DCenter());
        }
        const to = point(coordinates[0][3]);
        const options = { units: "kilometers" };

        const distance = rhumbDistance(from, to, options);

        return {
          lon: from.geometry.coordinates[0],
          lat: from.geometry.coordinates[1],
          dis: distance
        };
      }
      return {};
    },
    get3DCenter() {
      const { viewer, Cesium } = this;
      const centerResult = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(
          viewer.canvas.clientWidth / 2,
          viewer.canvas.clientHeight / 2
        )
      );
      const curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        centerResult
      );
      const lon = (curPosition.longitude * 180) / Math.PI;
      const lat = (curPosition.latitude * 180) / Math.PI;
      return [lon, lat];
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
        pageCount: this.cluster
          ? this.widgetInfo.dataStore.clusterMaxCount
          : 10,
        page: this.currentPageIndex,
        where,
        geometry:
          this.geoJSONExtent && JSON.stringify(this.geoJSONExtent) !== "{}"
            ? JSON.stringify(this.geoJSONExtent)
            : undefined,
        libName,
        decode: this.decode,
        lon,
        lat,
        dis,
        isEsGeoCode: true,
        typeName: this.name
      };
      this.spinning = true;
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
                allProperties.geometry = `(${feature.lon},${feature.lat})`;
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
        window.console.log(error);
      } finally {
        this.spinning = false;
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
      const combine = JSON.parse(this.config.combine);
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
        window.console.log(error);
      } finally {
        this.spinning = false;
      }
    },
    mouseOver(index) {
      if (this.config.panToCenterEventType === "click") {
        return;
      } else {
        this.selectMarkers = [this.geojson.features[index].properties.markerId];
        this.updataMarkers();
      }
    },
    mouseLeave(index) {
      if (this.config.panToCenterEventType === "click") {
        return;
      }
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
      if (this.config.panToCenterEventType === "hover") {
        return;
      } else {
        this.selectMarkers = [this.geojson.features[index].properties.markerId];
        this.$emit("click-item", this.geojson.features[index]);
        this.updataMarkers();
      }
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
