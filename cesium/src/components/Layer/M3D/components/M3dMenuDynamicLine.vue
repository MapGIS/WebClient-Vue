<template>
  <div class="mapgis-3d-m3d-menu-dynamicline">
    <mapgis-ui-divider> 泛光设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="光线颜色" required>
        <mapgis-ui-button size="small">
          <mapgis-ui-color-picker v-model="lightColor" />
        </mapgis-ui-button>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="扫描方向" required>
        <mapgis-ui-select
          :style="{ width: '100%' }"
          size="small"
          v-model="direction"
        >
          <mapgis-ui-select-option
            v-for="key in Object.keys(directions)"
            :key="key"
            :value="directions[key]"
          >
            {{ key }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="最小值" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="100000"
          v-model="min"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="最大值" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="100000"
          v-model="max"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="持续时间" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="1000000"
          v-model="duration"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="拖尾效果">
        <mapgis-ui-switch size="small" v-model="isGridTrail" />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="栅格宽度" v-if="isGridTrail">
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="1"
          :min="0"
          :max="1000000"
          v-model="gridWidth"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="栅格线宽度" v-if="isGridTrail">
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="1"
          :min="0"
          :max="1000000"
          v-model="gridLineWidth"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="栅格线宽度" v-if="isGridTrail">
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="1"
          :min="0"
          :max="1000000"
          v-model="gridLineWidth"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="栅格行数" v-if="isGridTrail">
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="1"
          :min="0"
          :max="1000000"
          v-model="gridRowNum"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>

    <mapgis-ui-button
      type="primary"
      @click="addEffect"
      :style="{ width: '100%' }"
      >执行动态线</mapgis-ui-button
    >
    <mapgis-ui-button
      :style="{ width: '100%', marginTop: '4px' }"
      @click="removeEffect"
      >删除动态线</mapgis-ui-button
    >
  </div>
</template>

<script>
import BaseLayer from "../BaseLayer";

export default {
  name: "mapgis-3d-m3d-menu-dynamic-line",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
  mixins: [BaseLayer],
  props: {
    version: {
      type: String
    },
    layerIndex: {
      type: Number
    }
  },
  data() {
    return {
      layout: "horizontal",
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      currentMenu: undefined,
      directions: {
        X轴正方向: 1.0,
        Y轴正方向: 2.0,
        Z轴正方向: 3.0,
        X轴负方向: -1.0,
        Y轴负方向: -2.0,
        Z轴负方向: -3.0
      },
      direction: 1.0,
      max: 150.0,
      min: 0.0,
      lightColor: "rgb(0.38, 0.88, 0.92)",
      duration: 5000,
      isGridTrail: false,
      gridWidth: 20,
      gridLineWidth: 0.05,
      gridLineColor: "rgb(0.38, 0.28, 1)",
      gridRowNum: 2
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    direction(next) {
      let { logic } = this;
      if (logic) {
        const {
          minHeight,
          maxHeight,
          minWidth,
          maxWidth,
          minLength,
          maxLength
        } = logic;
        switch (next) {
          case 1.0:
          case -1.0:
            this.min = minLength;
            this.max = maxLength;
            break;
          case 2.0:
          case -2.0:
            this.min = minWidth;
            this.max = maxWidth;
            break;
          case 3.0:
          case -3.0:
            this.min = minHeight;
            this.max = maxHeight;
            break;
        }
      }
    },
    layerIndex(next) {
      this.parseM3d();
    }
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      const { Cesium, vueIndex, vueKey, vueCesium } = this;
      const { viewer } = this;

      this.parseM3d();

      let dynamicline = this.createCesiumObject();
      dynamicline.then(res => {
        vueCesium.DynamicLightLineManager.addSource(vueKey, vueIndex, this, {});
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeEffect();
      this.$emit("unload", { component: this });
      vueCesium.DynamicLightLineManager.deleteSource(vueKey, vueIndex);
    },
    parseM3d() {
      let tileset = this.getM3DSet();
      let logic = this.$_getM3DBox(tileset).logic;
    },
    getM3DSet() {
      const { layerIndex, viewer, m3ds } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      return tileset;
    },
    addEffect() {
      const { vueKey, vueIndex, vueCesium, Cesium, viewer } = this;
      const {
        direction,
        min,
        max,
        lightColor,
        duration,
        isGridTrail,
        gridWidth,
        gridLineWidth,
        gridLineColor,
        gridRowNum
      } = this;

      let tileset = this.getM3DSet();
      if (!tileset) return;

      this.removeEffect();
      let dynamicline = new Cesium.DynamicLightLineEffect(
        viewer,
        [],
        tileset.root.transform,
        {
          direction,
          min,
          max,
          lightColor: new Cesium.Color.fromCssColorString(lightColor),
          duration,
          isGridTrail,
          gridWidth,
          gridLineWidth,
          gridLineColor,
          gridRowNum
        }
      );

      dynamicline.add();
      vueCesium.DynamicLightLineManager.changeOptions(
        vueKey,
        vueIndex,
        "dynamicline",
        dynamicline
      );
    },
    removeEffect() {
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.DynamicLightLineManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.dynamicline) {
        let dynamicline = find.options.dynamicline;
        dynamicline.remove && dynamicline.remove();
      }
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-dynamicline {
  height: 100%;
  width: 100%;
}
</style>
