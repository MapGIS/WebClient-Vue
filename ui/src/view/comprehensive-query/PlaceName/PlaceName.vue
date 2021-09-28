<template>
  <div class="place-name-container">
    <div class="float-pop-container" v-show="!showResult">
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
            :geometry="geometryData"
            @show-coords="showCoords"
            @click-item="clickItem"
            @update-geojson="currentResult"
          ></place-name-panel>
        </mapgis-ui-tab-pane>
      </mapgis-ui-tabs>
    </div>
  </div>
</template>

<script>
import PlaceNamePanel from "./PlaceNamePanel";
export default {
  name: "place-name",
  components: {
    PlaceNamePanel
  },
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
    }
  },
  data() {
    return {
      geometryData: null,
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
      return this.widgetInfo.placeName.queryTable;
    },
    showType() {
      return this.widgetInfo.placeName.showType;
    },
    config() {
      return this.widgetInfo.placeName || this.widgetInfo.dataStore;
    }
  },
  watch: {
    geometry: {
      immediate: true,
      handler(val) {
        this.geometryData = val;
      }
    },
    showType: {
      immediate: true,
      handler() {
        this.showTypeChange();
      }
    }
  },
  mounted() {
    if (this.selected.length === 0 && this.allItems.length > 0) {
      this.selected = [this.allItems[0].placeName];
    }
  },
  methods: {
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
    onChange(val) {
      const copy = JSON.parse(JSON.stringify(this.selected));
      this.selected = [];
      this.selected = copy;
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
      // TODO 该处后面要继续添加二三维的回调
      // if (!this.geometry) {
      //   this.geometryData = this.getBounds();
      // }
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
          this.openReseultSet(item, true);
        });
        this.selected.forEach(item => {
          this.openReseultSet(item);
        });
        this.selectedCopy = JSON.parse(JSON.stringify(this.selected));
      } else {
        this.showResult = false;
        this.$nextTick(() => {
          this.showResult = true;
          this.tab = this.selected[0];
        });
      }
    },
    reset() {
      this.showResult = false;
      this.tab = "";
      this.showTypeChange();
      this.markers = [];
      this.fieldConfigs = [];
      this.currentResult({})
    },
    removeResult() {
      // 点击关闭面板的时候，删除属性表里面所有的tab
      if (this.showResultSet === true) {
        this.selectedCopy.forEach(item => {
          this.openReseultSet(item, true);
        });
      }
    },
    /**
     * 当前展示的结果回调函数
     */
    currentResult(geojson) {
      this.$emit("current-result", geojson);
    },
    showCoords(markers, fieldConfigs, activeMarkers, activeFieldConfigs) {
      this.markers = [...markers, ...activeMarkers];
      this.fieldConfigs = [...fieldConfigs, ...activeFieldConfigs];
    },
    /**
     * 当前点击的条目的回调函数
     */
    clickItem(positionCoord) {
      this.$emit("click-item", positionCoord);
    },
    openReseultSet(item, isDelete) {
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
            geometry: this.geometryData,
            serverUrl: `http://${ip}:${port}/igs/rest/mrms/docs/${docName}`,
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
            geometry: this.geometryData
          }
        };
      }
      if (!isDelete) {
        // this.addExhibition(new AttributeTableExhibition(exhibition));
        // this.openExhibitionPanel();
      } else {
        // this.removeExhibition(exhibition.id);
      }
    }
  }
};
</script>
