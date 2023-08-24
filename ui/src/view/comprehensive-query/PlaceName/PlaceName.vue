<template>
  <div class="place-name-container">
    <div
      class="query-type-container"
      v-if="widgetInfo.dataStore"
      :class="{ query_type_container: decode }"
    >
      <span v-show="decode" style="padding-left:6px" class="info-container">
        <mapgis-ui-ant-icon type="info-circle"></mapgis-ui-ant-icon>
        西经(-)/南纬(-)/半径(km)
      </span>
      <span
        ><mapgis-ui-switch
          size="small"
          :checked="decode"
          @change="changeDecode"
        />
        <span>逆地址解析</span></span
      >
    </div>
    <div class="float-pop-container" v-show="!showResult">
      <span
        @click="selectAll"
        :class="{
          'place-name-active-text': isAllselected
        }"
        >全部</span
      >
      <span
        v-for="item in allItems"
        :key="`地名地址${item.placeName}`"
        @click="select(item)"
        :class="{
          'place-name-active-text': selected.indexOf(item.placeName) > -1
        }"
        >{{ item.placeName }}</span
      >
    </div>
    <div class="search-tab-container" v-if="showResult && !showResultSet">
      <div class="search-switch-container">
        <mapgis-ui-switch v-model="cluster" @change="onChange" size="small" />
        <span :class="{ 'place-name-active-text': cluster }">聚合展示</span>

        <mapgis-ui-iconfont
          class="action"
          style="flex: 1; text-align: right;"
          :type="shrink ? 'mapgis-up' : 'mapgis-down'"
          @click="shrink = !shrink"
        />
      </div>
      <mapgis-ui-tabs
        v-model="tab"
        type="card"
        v-show="!shrink"
        style="margin-top: 8px;"
      >
        <mapgis-ui-tab-pane v-for="item in selected" :key="item" :tab="item">
          <place-name-panel
            :defaultMarkerIcon="defaultMarkerIcon"
            :selectedMarkerIcon="selectedMarkerIcon"
            :widgetInfo="widgetInfo"
            :cluster="cluster"
            :name="item"
            :keyword="keyword"
            :activeTab="tab"
            :geometry="geometry"
            :decode="decode"
            :lon="lon"
            :lat="lat"
            :dis="dis"
            :geoJSONExtent="geoJSONExtent"
            :selectShowProperty="selectShowProperty"
            @select-markers="selectMarkers"
            @click-item="clickItem"
            @update-geojson="currentResult"
            @color-cluster="colorCluster"
          ></place-name-panel>
        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </div>
  </div>
</template>

<script>
import PlaceNamePanel from "./PlaceNamePanel";
import { LayerType } from "../util/document/layer/layer.js";

export default {
  name: "place-name",
  components: {
    PlaceNamePanel
  },
  inject: ["Cesium", "viewer", "map"],
  props: {
    defaultMarkerIcon: {
      type: String,
      default: ""
    },
    selectedMarkerIcon: {
      type: String,
      default: ""
    },
    widgetInfo: {
      type: Object,
      default: () => ({})
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
    },
    selectShowProperty: {
      type: Array,
      default: () => []
    },
    // 逆地址解析的经度
    lon: {
      type: [Number, String],
      default: ""
    },
    // 逆地址解析的纬度
    lat: {
      type: [Number, String],
      default: ""
    },
    // 逆地址解析的半径
    dis: {
      type: [Number, String],
      default: ""
    },
    is2DMapMode: {
      type: Boolean,
      default: false
    },
    searchPanelExpand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: [],
      selectedCopy: [],
      showResult: false,
      keyword: "",
      tab: "",
      markers: [],
      activeMarkers: [],
      activeFieldConfigs: [],
      fieldConfigs: [],
      cluster: false,
      // 结果集展示标志
      showResultSet: false,
      shrink: false
    };
  },
  computed: {
    allItems() {
      return this.config.queryTable;
    },
    showType() {
      return this.config.showType;
    },
    config() {
      return this.widgetInfo.placeName || this.widgetInfo.dataStore;
    },
    isDataStoreQuery() {
      return !!this.widgetInfo.dataStore;
    },
    isAllselected() {
      return this.allItems.length === this.selected.length;
    }
  },
  watch: {
    // geometry: {
    //   immediate: true,
    //   handler(val) {
    //     this.geometryData = val;
    //   }
    // },
    showType: {
      immediate: true,
      handler() {
        this.showTypeChange();
        this.$emit("change-cluster", this.cluster);
      }
    },
    tab: {
      immediate: true,
      handler(val) {
        this.$emit("select-item", val);
      }
    },
    is2DMapMode() {
      // 关闭某一模式下的拾取，打开另一模式下的拾取
      this.pickCoordinate2D();
    },
    searchPanelExpand() {
      this.pickCoordinate2D();
    }
  },
  mounted() {
    // 这里选择的是selected中还没值并且allItens中有值的
    if (this.selected.length === 0 && this.allItems.length > 0) {
      this.allItems.forEach(item => {
        if (item.select === true) {
          this.selected.push(item.placeName);
        }
      });
      // this.selected = [this.allItems[2].placeName];
    }
  },
  methods: {
    changeDecode(e) {
      this.$emit("change-decode", e);
      if (this.is2DMapMode) {
        this.pickCoordinate2D();
      } else {
        this.pickCoordinate3D();
      }
    },
    onClick({ lngLat: { lng, lat }, originalEvent: { srcElement } }) {
      const { className } = srcElement;
      if (className.indexOf("mapboxgl-marker") > -1) return;
      this.$emit("picked-coordinate", lng, lat);
    },
    pickCoordinate2D() {
      const canvas = this.map.getCanvasContainer();
      this.$nextTick(() => {
        if (this.decode && this.is2DMapMode && this.searchPanelExpand) {
          this.map.on("click", this.onClick);
          canvas.style.cursor = "default";
        } else {
          this.map.off("click", this.onClick);
          canvas.style.cursor = "";
        }
      });
    },
    pickCoordinate3D() {
      // 开启或者关闭鼠标拾取
      // 定义当前场景的画布元素的事件处理
      const handler = new this.Cesium.ScreenSpaceEventHandler(
        this.viewer.scene._canvas
      );
      // 设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
      handler.setInputAction(movement => {
        if (!this.searchPanelExpand) return;
        if (!this.decode) return;
        if (this.is2DMapMode) return;
        // 通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
        const { ellipsoid } = this.viewer.scene.globe;
        const cartesian = this.viewer.camera.pickEllipsoid(
          movement.position,
          ellipsoid
        );
        if (cartesian) {
          // 将笛卡尔坐标转换为地理坐标
          const cartographic = ellipsoid.cartesianToCartographic(cartesian);
          // 将弧度转为度的十进制度表示
          const lng = this.Cesium.Math.toDegrees(cartographic.longitude); // 转换后的经度
          const lat = this.Cesium.Math.toDegrees(cartographic.latitude); // 转换后的纬度
          this.$emit("picked-coordinate", lng, lat);
        }
      }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    selectAll() {
      if (this.isAllselected) {
        this.selected = [];
        this.selected.push(this.allItems[0].placeName);
      } else {
        this.allItems.forEach(item => {
          if (this.selected.indexOf(item.placeName) < 0) {
            this.selected.push(item.placeName);
          }
        });
      }
    },
    showTypeChange() {
      if (this.showType === "result") {
        this.showResultSet = true;
      } else if (this.showType === "normal") {
        this.showResultSet = false;
        this.cluster = false;
      } else if (this.showType === "cluster") {
        this.showResultSet = false;
        this.cluster = true;
      }
    },
    colorCluster(color) {
      this.$emit("color-cluster", color);
    },
    onChange(val) {
      const copy = JSON.parse(JSON.stringify(this.selected));
      this.selected = [];
      this.selected = copy;
      this.$emit("change-cluster", val);
    },
    select(item) {
      const index = this.selected.indexOf(item.placeName);
      if (index < 0) {
        this.selected.push(item.placeName);
      } else {
        if (this.selected.length > 1) {
          this.selected.splice(index, 1);
        } else {
          this.$message.warning("至少选中一个类别！");
        }
      }
    },
    search(keyword) {
      this.keyword = keyword;
      if (this.showResultSet) {
        const arr = [];
        // 删除属性表中不包含在此次选择项的tab
        this.selectedCopy.forEach(item => {
          let bool = false;
          this.selected.forEach(row => {
            if (row === item) {
              bool = true;
            }
          });
          arr.push(item);
        });
        arr.forEach(item => {
          this.isDataStoreQuery
            ? this.openDSResultSet(item, true)
            : this.openIGSReseultSet(item, true);
        });
        this.selected.forEach(item => {
          this.isDataStoreQuery
            ? this.openDSResultSet(item)
            : this.openIGSReseultSet(item);
        });
        this.selectedCopy = JSON.parse(JSON.stringify(this.selected));
      } else {
        this.showResult = false;
        this.$nextTick(() => {
          this.showResult = true;
          // 已经有tab时直接查询tab的数据，否则查询第一个
          this.tab = this.tab ? this.tab : this.selected[0];
        });
      }
    },
    selectedItem(name) {
      return this.allItems.find(item => name === item.placeName);
    },
    reset() {
      this.showResult = false;
      this.tab = "";
      this.showTypeChange();
      this.markers = [];
      this.fieldConfigs = [];
      this.currentResult({ type: "FeatureCollection", features: [] });
      this.$emit("change-cluster", this.cluster);
    },
    removeResult() {
      // 点击关闭面板的时候，删除属性表里面所有的tab
      if (this.showResultSet === true) {
        this.selectedCopy.forEach(item => {
          this.isDataStoreQuery
            ? this.openDSResultSet(item, true)
            : this.openIGSReseultSet(item, true);
        });
      }
    },
    /**
     * 当前展示的结果回调函数
     */
    currentResult(geojson) {
      this.$emit("current-result", geojson);
    },
    /**
     * 当前选中的坐标
     */
    selectMarkers(selectMarkers) {
      this.$emit("select-markers", selectMarkers);
    },
    /**
     * 当前点击的条目的回调函数
     */
    clickItem(feature) {
      this.$emit("click-item", feature);
    },
    openDSResultSet(item, isDelete) {
      const { queryWay, ip, port } = this.config;
      const { mLibsName, placeName } = this.selectedItem(item);
      const where = this.keyword;
      const exhibition = {
        id: `${placeName}`,
        name: `${placeName} 查询结果`,
        option: {
          ip: ip,
          port: Number(port),
          serverType: LayerType.EsGeoCode,
          libName: mLibsName,
          where,
          geometry:
            this.geoJSONExtent &&
            JSON.stringify(this.geoJSONExtent) !== "{}" &&
            this.keyword
              ? JSON.stringify(this.geoJSONExtent)
              : undefined
        }
      };
      if (!isDelete) {
        this.$emit("open-attribute-table", exhibition);
      } else {
        this.$emit("remove-attribute-table", exhibition.id);
      }
    },
    openIGSReseultSet(item, isDelete) {
      const { queryWay, ip, port, docName, allSearchName } = this.config;
      const {
        gdbp,
        placeName,
        LayerIndex,
        LayerName,
        searchField
      } = this.selectedItem(item);
      const where =
        this.keyword !== "" && this.keyword
          ? `${searchField || allSearchName} LIKE '%${this.keyword}%'`
          : `${searchField || allSearchName} LIKE '%'`;
      let exhibition = null;
      if (queryWay === "doc") {
        // 地图文档
        exhibition = {
          id: `${docName} ${LayerName} ${LayerIndex}`,
          name: `${LayerName} 查询结果`,
          description: `${docName} ${LayerName}`,
          option: {
            id: LayerIndex,
            name: LayerName,
            ip: ip,
            port: Number(port),
            serverType: LayerType.IGSMapImage,
            layerIndex: LayerIndex,
            serverName: docName,
            geometry: this.geometry,
            serverUrl: `${window.location.protocol}//${ip}:${port}/igs/rest/mrms/docs/${docName}`,
            where
          }
        };
      } else if (queryWay === "gdbp") {
        exhibition = {
          id: `${placeName}`,
          name: `${placeName} 查询结果`,
          option: {
            ip: ip,
            port: Number(port),
            serverType: LayerType.IGSVector,
            gdbp: gdbp,
            where,
            geometry: this.geometry
          }
        };
      }
      if (!isDelete) {
        this.$emit("open-attribute-table", exhibition);
        // this.addExhibition(new AttributeTableExhibition(exhibition));
        // this.openExhibitionPanel();
      } else {
        this.$emit("remove-attribute-table", exhibition.id);
        // this.removeExhibition(exhibition.id);
      }
    }
  }
};
</script>
