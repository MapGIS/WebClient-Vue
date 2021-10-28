<template>
  <div class="mapgis-3d-m3d-menu-bloom">
    <mapgis-ui-divider> 泛光设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="最大高度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="100000"
          v-model="maxHeight"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="颜色设置" required>
        <mapgis-ui-color-picker v-model="color" />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="混合比例" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="1"
          v-model="mixFactor"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-button
      type="primary"
      @click="bloomAction"
      :style="{ width: '100%' }"
      >执行泛光</mapgis-ui-button
    >
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-menu-bloom",
  inject: ["Cesium", "CesiumZondy", "vueCesium", "viewer", "m3ds"],
  props: {
    ...VueOptions,
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
      maxHeight: 30,
      color: "rgba(0, 0, 0.5, 0.4)",
      mixFactor: 0.5
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

      let bloom = this.createCesiumObject();
      bloom.then(res => {
        vueCesium.BloomEffectManager.addSource(vueKey, vueIndex, this, {});
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.BloomEffectManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let bloom = find.options.bloom;
        if (bloom) {
          bloom.remove();
        }
      }
      this.$emit("unload", { component: this });
      vueCesium.BloomEffectManager.deleteSource(vueKey, vueIndex);
    },
    bloomAction() {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds } = this;
      const { color, mixFactor, maxHeight } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      if (!tileset) {
        return;
      }
      let bloom;
      let find = vueCesium.BloomEffectManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.bloom) {
        bloom = find.options.bloom;
        bloom.remove();
      } else {
        bloom = new Cesium.BloomEffect(viewer, [], tileset.root.transform, {
          maxHeight: maxHeight,
          lightColor: new Cesium.Color.fromCssColorString(color),
          mixFactor: mixFactor
        });
      }
      bloom.add();
      vueCesium.BloomEffectManager.changeOptions(
        vueKey,
        vueIndex,
        "bloom",
        bloom
      );
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
