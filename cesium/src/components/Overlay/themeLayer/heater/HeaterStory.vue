<template>
  <div class="heater-story-control">
    <mapgis-ui-toolbar-command-group>
      <mapgis-ui-toolbar-command
        v-for="btn in toolbarBtns"
        @click="btn.method(btn)"
        :key="btn.title"
        :title="btn.title"
        :icon="btn.icon"
        :active="activeType === btn.type"
      />
    </mapgis-ui-toolbar-command-group>
    <mapgis-ui-setting-form layout="vertical" v-show="showSettingPanel">
      <template v-if="isCesium">
        <mapgis-ui-form-item label="是否聚合">
          <mapgis-ui-radio-group v-model="cesiumOptions.useClustering">
            <mapgis-ui-radio :value="true">是</mapgis-ui-radio>
            <mapgis-ui-radio :value="false">否</mapgis-ui-radio>
          </mapgis-ui-radio-group>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="半径大小">
          <mapgis-ui-input-number
            v-model="cesiumOptions.radius"
            :auto-width="true"
            :min="13"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="模糊大小">
          <mapgis-ui-input-number
            v-model="cesiumOptions.blur"
            :auto-width="true"
            :min="0.1"
            :max="1"
            :step="0.01"
          />
        </mapgis-ui-form-item>
      </template>
      <template v-else-if="isMapv">
        <mapgis-ui-form-item label="半径大小">
          <mapgis-ui-input-number
            v-model="mapvOptions.size"
            :auto-width="true"
            :min="13"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="最大权重">
          <mapgis-ui-input-number
            v-model="mapvOptions.max"
            :auto-width="true"
            :min="1"
          />
        </mapgis-ui-form-item>
      </template>
      <mapgis-ui-form-item label="填充颜色">
        <!-- <color-picker-setting v-model="options.gradient" /> -->
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
    <template v-if="activeType">
      <mapgis-3d-mapv-heater-layer
        v-if="isMapv"
        :options="mapvOptions"
        :geojson="geojson"
        :field="field"
      />
      <mapgis-3d-cesium-heater-layer
        v-else-if="bound"
        :options="cesiumOptions"
        :geojson="geojson"
        :field="field"
        :bound="bound"
      />
    </template>
  </div>
</template>
<script>
import { log } from "../../../Utils/log";
import Mapgis3dCesiumHeaterLayer from "./CesiumHeater.vue";
import Mapgis3dMapvHeaterLayer from "./MapvHeater.vue";

const typeEnum = {
  MAPV: "MAPV",
  CESIUM: "CESIUM"
};

export default {
  name: "heater-story",
  inject: ["Cesium"],
  components: {
    "mapgis-3d-cesium-heater-layer": Mapgis3dCesiumHeaterLayer,
    "mapgis-3d-mapv-heater-layer": Mapgis3dMapvHeaterLayer
  },
  props: {
    enableModel: {
      type: Boolean,
      default: false
    }
  },
  data: vm => ({
    showSettingPanel: false,
    type: typeEnum.MAPV,
    activeType: "",
    field: "count",
    bound: null,
    geojson: null,
    cesiumOptions: {
      useClustering: true,
      blur: 0.85,
      radius: 20
    },
    mapvOptions: {
      size: 20,
      max: 100
    },
    toolbarBtns: [
      {
        title: "mapv",
        icon: "mapgis-layer1",
        type: typeEnum.MAPV,
        method: vm.showHeaterLayer
      },
      {
        title: "原生",
        icon: "mapgis-svgglobalselect",
        type: typeEnum.CESIUM,
        method: vm.showHeaterLayer
      },
      {
        title: "清除",
        icon: "mapgis-shanchu_dianji",
        method: vm.removeHeaterLayer
      },
      {
        title: "设置",
        icon: "mapgis-setting",
        method: vm.toggleSettingPanel
      }
    ]
  }),
  computed: {
    isMapv({ activeType }) {
      return activeType === typeEnum.MAPV;
    },
    isCesium({ activeType }) {
      return activeType === typeEnum.CESIUM;
    }
  },
  methods: {
    toggleSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel;
    },
    mockCesiumBound() {
      return {
        east: 114.40417819778051,
        north: 30.469278757013154,
        south: 30.465101046619523,
        west: 114.39874205680401
      };
    },
    mockCesiumGeoJson() {
      const { east, north, west, south } = this.bound;
      const [pointX, pointY] = this.Cesium.Cartesian3.fromDegreesArray([
        west,
        north,
        west,
        south,
        east,
        south,
        east,
        north
      ]);
      const boundsHeight = this.Cesium.Cartesian3.distance(pointX, pointY);
      const boundsWidth = this.Cesium.Cartesian3.distance(pointX, pointY);
      const step = Math.ceil((boundsHeight / 20) * (boundsWidth / 20));
      const count = step > 10000 ? 10000 : step;
      const pointArr = this.Cesium.CommonFunction.getRandomPointByRect(
        west,
        south,
        east,
        north,
        count
      );
      const features = pointArr.map(({ x, y }) => ({
        type: "Feature",
        properties: {
          [this.field]: (Math.random() * 100).toFixed(2)
        },
        geometry: {
          type: "Point",
          coordinates: [x, y]
        }
      }));
      return {
        type: "FeatureCollection",
        dataCount: features.length,
        features
      };
    },
    mockMapvBound() {
      return {
        east: 124.40417819778051,
        north: 39.469278757013154,
        south: 20.465101046619523,
        west: 80.39874205680401
      };
    },
    mockMapvGeoJson() {
      return {
        type: "FeatureCollection",
        dataCount: 500,
        features: new Array(500).fill("Point").map((type, i) => ({
          geometry: {
            type,
            coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20]
          },
          properties: {
            [this.field]: 30 * Math.random()
          }
        }))
      };
    },
    showHeaterLayer({ type }) {
      this.type = type;
      this.activeType = type;
      if (!this.geojson) {
        if (this.enableModel) {
          this.bound = this.mockCesiumBound();
          this.geojson = this.mockCesiumGeoJson();
        } else {
          this.bound = this.mockMapvBound();
          this.geojson = this.mockMapvGeoJson();
        }
      }
    },
    removeHeaterLayer() {
      this.geojson = null;
      this.activeType = "";
    }
  }
};
</script>
<style scoped>
.heater-story-control {
  min-width: 180px;
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fff;
  z-index: 100;
}
.heater-story-control > div {
  padding: 4px 10px;
  justify-content: space-between;
}
form {
  padding: 10px;
}
</style>
