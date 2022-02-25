<template>
  <div class="mapgis-ui-map-outline-container">
    <div class="mapgis-ui-map-outline-title">{{ title }}</div>
    <mapgis-ui-row style="margin-bottom: 10px;padding-right: 11px;">
      <mapgis-ui-col span="18">
      </mapgis-ui-col>
      <mapgis-ui-col span="6">
        <mapgis-ui-button class="mapgis-ui-map-outline-add" @click="$_addMap">附加地图</mapgis-ui-button>
      </mapgis-ui-col>
    </mapgis-ui-row>
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
        title="基地址"
        type="MapgisUiInput"
        v-model="baseUrl"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'WMS' || currentSelect === 'DOC'"
        title="图层名称"
        type="MapgisUiInput"
        v-model="layers"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'WMTS'"
        title="图层名称"
        type="MapgisUiInput"
        v-model="layer"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'DYNAMIC'"
        title="gdbp地址"
        type="MapgisUiInput"
        v-model="gdbps"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'TILE' || currentSelect === 'WMTS'"
        title="坐标系"
        type="MapgisUiInput"
        v-model="tilingScheme"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'TILE' || currentSelect === 'WMTS'"
        title="比例尺"
        type="MapgisUiInput"
        v-model="tileMatrixSet"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'WMTS'"
        title="返回格式"
        type="MapgisUiInput"
        v-model="format"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-map-outline",
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
        width: "211px",
        marginLeft: "-26px",
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
.mapgis-ui-map-outline-container {
  width: 100%;
  height: auto;
  position: relative;
  border: 1px solid rgb(95, 99, 104);
  border-radius: 4px;
  padding: 14px;
  margin-top: 0;
}

.mapgis-ui-map-outline-container:hover {
  border-color: #269ff0;
}

.mapgis-ui-map-outline-title {
  position: absolute;
  top: -10px;
  left: 17px;
  z-index: 1;
  padding: 0 10px;
}

.mapgis-ui-map-outline-add {
  margin-left: -10px;
}
</style>