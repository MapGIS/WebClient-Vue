<template>
  <div class="mapgis-ui-map-select-container">
    <div class="mapgis-ui-map-select-title">
      <mapgis-ui-title-icon/>
      {{ title }}
    </div>
    <div class="mapgis-ui-map-select-content">
      <mapgis-ui-mix-row
          title="地图类型"
          type="MapgisUiSelect"
          :titleStyle="titleStyle"
          :mainStyle="mainStyle"
          :formStyle="formStyle"
          :dataSource="selectData"
          v-model="currentSelect"
      />
      <mapgis-ui-mix-row
          title="地图名称"
          type="MapgisUiSelect"
          :titleStyle="titleStyle"
          :mainStyle="mainStyle"
          :formStyle="formStyle"
          :dataSource="selectData"
          v-model="currentSelect"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-map-select",
  data() {
    return {
      baseUrl: "",
      layers: "",
      layer: "",
      tilingScheme: "",
      tileMatrixSet: "",
      format: "image/png",
      gdbps: "",
      currentSelect: "TILE",
      titleStyle: {
        fontSize: "14px",
        top: "4px"
      },
      formStyle: {
        marginBottom: "0"
      },
      mainStyle: {
        width: "158px",
        marginLeft: "-8px",
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
      }]
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    map: {
      type: Object,
      default() {
        return {}
      }
    },
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
    $_initMap() {
      const {
        type = "TILE",
        baseUrl = "",
        layer = "",
        layers = "",
        tilingScheme = "",
        tileMatrixSet = "",
        format = "image/png"
      } = this.map;
      this.currentSelect = type;
      this.baseUrl = baseUrl;
      this.layer = layer;
      this.layers = layers;
      this.tilingScheme = tilingScheme;
      this.tileMatrixSet = tileMatrixSet;
      this.format = format;
    },
    $_addMap() {
      let map;
      switch (this.currentSelect) {
        case "WMS":
          map = {
            type: "WMS",
            baseUrl: this.baseUrl,
            layers: this.layers
          };
          this.$emit("addMap", "WMS", map);
          break;
        case "WMTS":
          map = {
            type: "WMTS",
            baseUrl: this.baseUrl,
            layer: this.layer,
            tilingScheme: this.tilingScheme,
            tileMatrixSet: this.tileMatrixSet,
            format: this.format,
          };
          this.$emit("addMap", "WMTS", map);
          break;
        case "TILE":
          map = {
            type: "TILE",
            baseUrl: this.baseUrl,
            tilingScheme: this.tilingScheme
          };
          this.$emit("addMap", "TILE", map);
          break;
        case "DYNAMIC":
          map = {
            type: "DYNAMIC",
            baseUrl: this.baseUrl,
            gdbps: this.gdbps
          };
          this.$emit("addMap", "DYNAMIC", map);
          break;
        case "DOC":
          map = {
            type: "DOC",
            baseUrl: this.baseUrl,
            layers: this.layers
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
  margin-top: 6px;
  margin-bottom: 4px;
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
  height: 92px;
  background: #F1F1F1;
  border-radius: 3px;
  padding-top: 6px;
  padding-left: 10px;
}
</style>