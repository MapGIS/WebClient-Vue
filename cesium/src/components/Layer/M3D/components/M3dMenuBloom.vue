<template>
  <div class="mapgis-3d-m3d-menu-bloom">
    <mapgis-ui-divider> 泛光设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="颜色设置" required>
        <mapgis-ui-button size="small">
          <mapgis-ui-color-picker v-model="lightColor" />
        </mapgis-ui-button>
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="最小高度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="100000"
          v-model="minHeight"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="最大高度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="100000"
          v-model="maxHeight"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="混合系数" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="1"
          v-model="mixFactor"
        />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item label="呼吸开启">
        <mapgis-ui-switch size="small" v-model="startBreath" />
      </mapgis-ui-form-model-item>

      <mapgis-ui-form-model-item>
        <span slot="label">
          <mapgis-ui-tooltip
            title="呼吸灯速度,建议取值区间(0,0.1)，值越小，闪烁速度越慢"
          >
            <mapgis-ui-iconfont type="mapgis-info" />
          </mapgis-ui-tooltip>
          呼吸速度
        </span>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="100000"
          v-model="breathSpeed"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>

    <mapgis-ui-button
      type="primary"
      @click="addEffect"
      :style="{ width: '100%' }"
      >执行泛光</mapgis-ui-button
    >
    <mapgis-ui-button
      :style="{ width: '100%', marginTop: '4px' }"
      @click="removeEffect"
      >删除泛光</mapgis-ui-button
    >
  </div>
</template>

<script>
import BaseLayer from "../BaseLayer";

export default {
  name: "mapgis-3d-m3d-menu-bloom",
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
  watch: {
    layerIndex(next) {
      this.parseM3d();
    }
  },
  data() {
    return {
      layout: "horizontal",
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      currentMenu: undefined,
      maxHeight: 20,
      minHeight: 0.00000001,
      lightColor: "rgba(0, 0, 0.5, 0.4)",
      mixFactor: 0.8,
      startBreath: false,
      breathSpeed: 0.05
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
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

      let bloom = this.createCesiumObject();
      bloom.then(res => {
        vueCesium.BloomEffectManager.addSource(vueKey, vueIndex, this, {});
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeEffect();
      this.$emit("unload", { component: this });
      vueCesium.BloomEffectManager.deleteSource(vueKey, vueIndex);
    },
    parseM3d() {
      let tileset = this.getM3DSet();
      let logic = this.$_getM3DBox(tileset).logic;
      this.minHeight = logic.minHeight;
      this.maxHeight = logic.maxHeight;
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
        lightColor,
        mixFactor,
        minHeight,
        maxHeight,
        startBreath,
        breathSpeed
      } = this;
      let tileset = this.getM3DSet();
      if (!tileset) return;

      this.removeEffect();

      let bloom = new Cesium.BloomEffect(viewer, [], tileset.root.transform, {
        minHeight: minHeight,
        maxHeight: maxHeight,
        lightColor: new Cesium.Color.fromCssColorString(lightColor),
        mixFactor: mixFactor,
        startBreath: startBreath,
        breathSpeed: breathSpeed
      });

      bloom.add();
      if (startBreath) bloom.startBreathLight();
      vueCesium.BloomEffectManager.changeOptions(
        vueKey,
        vueIndex,
        "bloom",
        bloom
      );
    },
    removeEffect() {
      const { vueKey, vueIndex, vueCesium, startBreath } = this;
      let find = vueCesium.BloomEffectManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.bloom) {
        let bloom = find.options.bloom;
        bloom.remove && bloom.remove();
        if (startBreath) bloom.stopBreathLight();
      }
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-bloom {
  height: 100%;
  width: 100%;
}
</style>
