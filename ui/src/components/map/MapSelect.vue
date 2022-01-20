<template>
  <div class="mapgis-ui-map-select-container">
    <div class="mapgis-ui-map-select-title" :style="topTitleStyle">
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
      {{ title }}
      <span @click="$_showMore" class="mapgis-ui-map-select-show-more">
           {{ showMoreTitle }}
      </span>
    </div>
    <div class="mapgis-ui-map-select-content">
      <mapgis-ui-mix-row
        title="地图类型"
        type="MapgisUiSelect"
        :titleStyle="titleStyle"
        :mainStyle="mainStyle"
        :formStyle="formStyle"
        :dataSource="selectData"
        v-model="mapCopy.type"
      />
      <mapgis-ui-mix-row
        title="地图名称"
        type="MapgisUiSelect"
        :titleStyle="titleStyle"
        :mainStyle="mainStyle"
        :formStyle="formStyle"
        :dataSource="mapNamesCopy[mapCopy.type]"
        v-model="currentMapName"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-map-select",
  data() {
    return {
      mapCopy: {
        type: "TILE",
        baseUrl: "",
        layers: "",
        layer: "",
        tilingScheme: "",
        tileMatrixSet: "",
        format: "image/png",
        gdbps: "",
      },
      currentMapName: "",
      formStyle: {
        marginBottom: "0"
      },
      mapNamesCopy: {
        "TILE": [],
        "DOC": [],
        "DYNAMIC": [],
        "GeoJSON": [],
        "WMTS": [],
        "WMS": [],
      },
      selectData: [{
        key: "IGS瓦片",
        value: "TILE",
      }, {
        key: "IGS地图文档",
        value: "DOC",
      }, {
        key: "IGS矢量图层",
        value: "DYNAMIC",
      }, {
        key: "GeoJSON",
        value: "GeoJSON",
      }, {
        key: "WMTS地图",
        value: "WMTS",
      }, {
        key: "WMS地图",
        value: "WMS",
      }],
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    showTitleIcon: {
      type: Boolean,
      default: true
    },
    showMoreTitle: {
      type: String,
      default: "展开高级选项"
    },
    map: {
      type: Object,
      default() {
        return {}
      }
    },
    topTitleStyle: {
      type: Object
    },
    titleStyle: {
      type: Object
    },
    mainStyle: {
      type: Object
    }
  },
  watch: {
    map: {
      handler: function () {
        this.$_initMap();
      },
      deep: true
    }
  },
  mounted() {
    this.$_initMap();
  },
  methods: {
    $_showMore() {
      this.$emit("showMore");
    },
    $_initMap() {
      this.mapCopy = Object.assign(this.mapCopy, this.map);
      const {type, layers, layer} = this.mapCopy;
      if (type && (type === "WMS" || type === "DOC")) {
        this.mapNamesCopy[type].splice(0, 0, {
          key: layers,
          value: layers
        });
        this.currentMapName = layers;
      } else if (type && (type === "WMTS")) {
        this.mapNamesCopy[type].splice(0, 0, {
          key: layer,
          value: layer
        });
        this.currentMapName = layer;
      }
    },
    $_addMap() {
      let map;
      switch (this.currentSelect) {
        case "WMS":
          map = {
            type: "WMS",
            baseUrl: this.mapCopy.baseUrl,
            layers: this.mapCopy.layers
          };
          this.$emit("addMap", "WMS", map);
          break;
        case "WMTS":
          map = {
            type: "WMTS",
            baseUrl: this.mapCopy.baseUrl,
            layer: this.mapCopy.layer,
            tilingScheme: this.mapCopy.tilingScheme,
            tileMatrixSet: this.mapCopy.tileMatrixSet,
            format: this.mapCopy.format,
          };
          this.$emit("addMap", "WMTS", map);
          break;
        case "TILE":
          map = {
            type: "TILE",
            baseUrl: this.mapCopy.baseUrl,
            tilingScheme: this.mapCopy.tilingScheme
          };
          this.$emit("addMap", "TILE", map);
          break;
        case "DYNAMIC":
          map = {
            type: "DYNAMIC",
            baseUrl: this.mapCopy.baseUrl,
            gdbps: this.mapCopy.gdbps
          };
          this.$emit("addMap", "DYNAMIC", map);
          break;
        case "DOC":
          map = {
            type: "DOC",
            baseUrl: this.mapCopy.baseUrl,
            layers: this.mapCopy.layers
          };
          this.$emit("addMap", "DOC", map);
          break;
      }
    },
    $_selectChange(e) {
      this.currentSelect = e;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-map-select-title {
  font-weight: bolder;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 12px;
}

.mapgis-ui-map-select-container {
  width: 100%;
  height: auto;
  position: relative;
  border-radius: 4px;
  margin-top: 0;
  margin-bottom: 10px;
}

.mapgis-ui-map-select-container:hover {
  border-color: #269ff0;
}

.mapgis-ui-map-select-content {
  width: 100%;
  height: 65px;
  border-radius: 3px;
  padding-top: 0;
  padding-left: 0;
}

.mapgis-ui-map-select-show-more {
  float: right;
  color: #0081E2;
  cursor: pointer;
}
</style>