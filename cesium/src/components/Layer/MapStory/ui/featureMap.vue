<template>
  <div class="mapgis-feature-map-container">
    <div class="mapgis-feature-map-title">{{ title }}</div>
    <mapgis-ui-row style="margin-bottom: 10px">
      <mapgis-ui-col span="18">
      </mapgis-ui-col>
      <mapgis-ui-col span="6">
        <mapgis-ui-button class="mapgis-feature-map-add" @click="$_addMap">附加地图</mapgis-ui-button>
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
        v-if="currentSelect === 'WMS地图' || currentSelect === 'IGS地图文档' || currentSelect === 'WMTS地图'"
        title="图层名称"
        type="MapgisUiInput"
        v-model="layers"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'IGS矢量图层'"
        title="gdbp地址"
        type="MapgisUiInput"
        v-model="gdbps"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'IGS瓦片' || currentSelect === 'WMTS地图'"
        title="坐标系"
        type="MapgisUiInput"
        v-model="tilingScheme"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
    <mapgis-ui-mix-row
        v-if="currentSelect === 'IGS瓦片' || currentSelect === 'WMTS地图'"
        title="比例尺"
        type="MapgisUiInput"
        v-model="tileMatrixSet"
        :titleStyle="titleStyle"
        :formStyle="formStyle"
    />
  </div>
</template>

<script>

export default {
  name: "featureMap",
  data() {
    return {
      baseUrl: "",
      layers: "",
      tilingScheme: "",
      tileMatrixSet: "",
      gdbps: "",
      currentSelect: "IGS瓦片",
      titleStyle: {
        color: "#e8eaed",
        paddingLeft: "12px"
      },
      formStyle: {
        marginBottom: "0"
      },
      mainStyle: {
        width: "234px",
        marginLeft: "-26px",
      },
      selectData: [{
        key: "IGS瓦片",
        value: "IGS瓦片",
      },{
        key: "IGS地图文档",
        value: "IGS地图文档",
      },{
        key: "IGS矢量图层",
        value: "IGS矢量图层",
      },{
        key: "GeoJSON",
        value: "GeoJSON",
      },{
        key: "WMTS地图",
        value: "WMTS地图",
      },{
        key: "WMS地图",
        value: "WMS地图",
      }]
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
  },
  watch: {},
  created() {
  },
  methods: {
    $_addMap() {
      let map;
      switch (this.currentSelect) {
        case "WMS地图":
          map = {
            type: "WMS",
            baseUrl: this.baseUrl,
            layers: this.layers
          };
          this.$emit("addMap", "WMS", map);
          break;
        case "WMTS地图":
          map = {
            type: "WMTS",
            baseUrl: this.baseUrl,
            layer: this.layers,
            tilingScheme: this.tilingScheme,
            tileMatrixSet: this.tileMatrixSet,
          };
          this.$emit("addMap", "WMTS", map);
          break;
        case "IGS瓦片":
          map = {
            type: "TILE",
            baseUrl: this.baseUrl,
            tilingScheme: this.tilingScheme
          };
          this.$emit("addMap", "TILE", map);
          break;
        case "IGS矢量图层":
          map = {
            type: "DYNAMIC",
            baseUrl: this.baseUrl,
            gdbps: this.gdbps
          };
          this.$emit("addMap", "DYNAMIC", map);
          break;
        case "IGS地图文档":
          map = {
            type: "DYNAMIC",
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
.mapgis-feature-map-container {
  width: 342px;
  height: auto;
  position: relative;
  border: 1px solid rgb(95, 99, 104);
  border-radius: 4px;
  margin: 26px;
  padding: 14px;
  margin-top: 0;
}

.mapgis-feature-map-container:hover {
  border-color: #269ff0;
}

.mapgis-feature-map-title {
  position: absolute;
  top: -10px;
  left: 17px;
  z-index: 1;
  padding: 0 10px;
  color: #e8eaed;
  background: rgb(32, 33, 36);
}

.mapgis-feature-map-add{
  color: #e8eaed;
  border-color: rgb(95, 99, 104);
  margin-left: -10px;
}
</style>