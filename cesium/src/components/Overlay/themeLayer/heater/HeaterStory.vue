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
      <template v-if="!isMapv">
        <mapgis-ui-form-item label="是否聚合">
          <mapgis-ui-radio-group v-model="options.useClustering">
            <mapgis-ui-radio :value="true">是</mapgis-ui-radio>
            <mapgis-ui-radio :value="false">否</mapgis-ui-radio>
          </mapgis-ui-radio-group>
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="半径大小">
          <mapgis-ui-input-number
            :auto-width="true"
            v-model="options.radius"
            :min="13"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="模糊大小">
          <mapgis-ui-input-number
            :auto-width="true"
            v-model="options.blur"
            :min="0.1"
            :max="1"
          />
        </mapgis-ui-form-item>
      </template>
      <template v-else>
        <mapgis-ui-form-item label="半径大小">
          <mapgis-ui-input-number
            :auto-width="true"
            v-model="options.size"
            :min="13"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="最大权重">
          <mapgis-ui-input-number
            :auto-width="true"
            v-model="options.max"
            :min="1"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="模糊大小">
          <mapgis-ui-input-number
            :auto-width="true"
            v-model="options.size"
            :min="13"
          />
        </mapgis-ui-form-item>
      </template>
      <!-- <mapgis-ui-form-item label="填充颜色"> -->
      <!-- <color-picker-setting v-model="options.gradient" /> -->
      <!-- </mapgis-ui-form-item> -->
    </mapgis-ui-setting-form>
    <mapgis-3d-heater-layer
      :type="type"
      :field="field"
      :options="options"
      :data-source="geojson"
      v-if="activeType"
    />
  </div>
</template>
<script>
import { log } from "../../../Utils/log";
import Mapgis3dHeaterLayer from "./Heater.vue";

const typeEnum = {
  MAPV: "MAPV",
  CESIUM: "CESIUM"
};

export default {
  name: "heater-story",
  components: {
    "mapgis-3d-heater-layer": Mapgis3dHeaterLayer
  },
  data: vm => ({
    showSettingPanel: false,
    type: typeEnum.MAPV,
    activeType: "",
    field: "",
    geojson: null,
    options: {
      blur: 0.85,
      radius: 20,
      useClustering: true,
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
    }
  },
  methods: {
    mockGeoJson() {
      return {
        features: new Array(500).fill("Point").map(type => ({
          geometry: {
            type,
            coordinates: [75 + Math.random() * 50, 20.3 + Math.random() * 20]
          },
          properties: {
            count: 30 * Math.random()
          }
        }))
      };
    },
    toggleSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel;
    },
    showHeaterLayer({ type }) {
      this.type = type;
      this.activeType = type;
      if (!this.geojson) {
        this.geojson = this.mockGeoJson();
      }
    },
    removeHeaterLayer() {
      this.geojson = null;
      this.activeType = "";
      this.type = typeEnum.MAPV;
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
