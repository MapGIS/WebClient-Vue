<template>
  <div class="mapgis-ui-map-multi-rows-container">
    <div v-if="showTitle" class="mapgis-ui-map-multi-rows-title">
      <mapgis-ui-title-icon/>
      {{ title }}
      <span @click="$_showMore" class="mapgis-ui-map-multi-rows-show-more">
        {{ showMoreTitle }}
      </span>
    </div>
    <div class="mapgis-ui-set-camera-set-camera-content">
      <mapgis-ui-mix-row
          title="类型"
          type="MapgisUiSelect"
          :titleStyle="titleStyle"
          :mainStyle="mainStyle"
          :formStyle="formStyle"
          :dataSource="selectData"
          :props="selectProps"
          v-model="mapCopy.type"
      />
      <mapgis-ui-mix-row
          title="基地址"
          type="MapgisUiInput"
          v-model="mapCopy.baseUrl"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'WMS' || mapCopy.type === 'DOC'"
          title="图层名称"
          type="MapgisUiInput"
          v-model="mapCopy.layers"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'WMTS'"
          title="图层名称"
          type="MapgisUiInput"
          v-model="mapCopy.layer"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'DYNAMIC'"
          title="gdbp地址"
          type="MapgisUiInput"
          v-model="mapCopy.gdbps"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'TILE' || mapCopy.type === 'WMTS'"
          title="坐标系"
          type="MapgisUiInput"
          v-model="mapCopy.tilingScheme"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'TILE' || mapCopy.type === 'WMTS'"
          title="比例尺"
          type="MapgisUiInput"
          v-model="mapCopy.tileMatrixSet"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
      <mapgis-ui-mix-row
          v-if="mapCopy.type === 'WMTS'"
          title="返回格式"
          type="MapgisUiInput"
          v-model="mapCopy.format"
          :titleStyle="titleStyle"
          :formStyle="formStyle"
          :mainStyle="mainStyle"
      />
    </div>
    <mapgis-ui-button @click="$_addMap" class="mapgis-ui-map-multi-rows-save" type="primary">
      保存
    </mapgis-ui-button>
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-map-multi-rows",
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
      formStyle: {
        marginBottom: "-4px",
      },
      mainStyle: {
        height: "32px",
        width: "178px",
      },
      titleStyle: {
        paddingLeft: "12px"
      },
      selectProps: {
        titleCol: 6,
        selectCol: 18
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
    showMoreTitle: {
      type: String,
      default: "展开高级选项"
    },
    showTitle: {
      type: Boolean,
      default: true
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
        this.mapCopy = Object.assign(this.mapCopy, this.map);
      },
      deep: true
    }
  },
  created() {
    this.mapCopy = Object.assign(this.mapCopy, this.map);
  },
  methods: {
    $_showMore() {
      this.$emit("showMore");
    },
    $_addMap() {
      let map;
      switch (this.mapCopy.type) {
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
      this.mapCopy.type = e;
    }
  }
}
</script>

<style scoped>
.mapgis-ui-map-multi-rows-title {
  margin-top: 6px;
  margin-bottom: 4px;
  padding-left: 12px;
}

.mapgis-ui-map-multi-rows-container {
  width: 100%;
  height: auto;
  position: relative;
  border-radius: 4px;
  margin-top: 0;
  margin-bottom: 10px;
}

.mapgis-ui-map-multi-rows-container:hover {
  border-color: #269ff0;
}

.mapgis-ui-map-multi-rows-show-more {
  float: right;
  color: #0081E2;
  cursor: pointer;
}

.mapgis-ui-set-camera-set-camera-content {
  width: 100%;
  height: auto;
  background: #F1F1F1;
  border-radius: 3px;
  padding-top: 7px;
  padding-bottom: 7px;
}

.mapgis-ui-map-multi-rows-save {
  width: 100%;
  height: 32px;
  margin-top: 10px;
  background: #1890FF;
}
</style>