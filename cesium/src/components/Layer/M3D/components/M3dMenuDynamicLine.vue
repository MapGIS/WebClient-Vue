<template>
  <div class="mapgis-3d-m3d-menu-dynamicline">
    <mapgis-ui-divider> 扫描设置 </mapgis-ui-divider>
    <mapgis-ui-color-pick-panel
      transparent
      label="光线颜色"
      v-model="lightColor"
      :disableAlpha="false"
    />
    <mapgis-ui-select-panel
      transparent
      label="扫描方向"
      v-model="direction"
      :selectOptions="Object.keys(directions)"
    />

    <mapgis-ui-input-number-panel
      transparent
      size="small"
      label="最小值"
      v-model="min"
      :range="[0, 1000]"
    >
    </mapgis-ui-input-number-panel>

    <mapgis-ui-input-number-panel
      transparent
      size="small"
      label="最大值"
      v-model="max"
      :range="[0, 1000]"
    >
    </mapgis-ui-input-number-panel>

    <mapgis-ui-input-number-panel
      transparent
      size="small"
      label="持续时间"
      v-model="duration"
      :range="[0, 10000]"
    >
    </mapgis-ui-input-number-panel>

    <mapgis-ui-switch-panel
      v-model="isGridTrail"
      label="拖尾效果"
      size="small"
      layout="horizontal"
    >
      <mapgis-ui-input-number-panel
        transparent
        size="small"
        label="栅格宽度"
        v-model="gridWidth"
        :range="[0, 1000]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        transparent
        size="small"
        label="栅格线宽度"
        v-model="gridLineWidth"
        :range="[0, 1000]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        transparent
        size="small"
        label="栅格行数"
        v-model="gridRowNum"
        :range="[0, 1000]"
      >
      </mapgis-ui-input-number-panel>
    </mapgis-ui-switch-panel>

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
      direction: "Z轴正方向",
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
          case "X轴正方向":
          case "X轴负方向":
            this.min = minLength;
            this.max = maxLength;
            break;
          case "Y轴正方向":
          case "Y轴负方向":
            this.min = minWidth;
            this.max = maxWidth;
            break;
          case "Z轴正方向":
          case "Z轴负方向":
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
        directions,
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
      let direct = directions[direction];

      this.removeEffect();
      let dynamicline = new Cesium.DynamicLightLineEffect(
        viewer,
        [],
        tileset.root.transform,
        {
          direct,
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
