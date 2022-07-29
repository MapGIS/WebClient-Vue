<template>
  <div class="mapgis-3d-m3d-menu-bloom">
    <mapgis-ui-divider style="fontSize:14px"> 泛光设置 </mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-bloom-content">
      <div>
        <mapgis-ui-color-pick-panel
          transparent
          label="颜色设置"
          v-model="lightColor"
          :disableAlpha="false"
          :labelCol="24"
          :wrapperCol="24"
        />

        <mapgis-ui-input-number-panel
          transparent
          size="large"
          label="最小高度"
          v-model="minHeight"
          :range="[0, 1000]"
        >
        </mapgis-ui-input-number-panel>

        <mapgis-ui-input-number-panel
          transparent
          size="large"
          label="最大高度"
          v-model="maxHeight"
          :range="[0, 1000]"
        >
        </mapgis-ui-input-number-panel>

        <mapgis-ui-input-number-panel
          transparent
          size="large"
          label="混合系数"
          v-model="mixFactor"
          :step="0.1"
          :range="[0, 1]"
        >
        </mapgis-ui-input-number-panel>
      </div>

      <mapgis-ui-switch-panel
        v-model="startBreath"
        label="呼吸开启"
        size="small"
        layout="horizontal"
      >
        <mapgis-ui-input-number-panel
          size="large"
          label="呼吸速度"
          tooltip="呼吸灯速度,建议取值区间(0,0.1)，值越小，闪烁速度越慢"
          v-model="breathSpeed"
          :step="0.1"
          :range="[0, 1]"
        >
        </mapgis-ui-input-number-panel>
      </mapgis-ui-switch-panel>
    </div>
    <mapgis-ui-setting-footer>
      <mapgis-ui-button type="primary" @click="addEffect">执行泛光</mapgis-ui-button>
      <mapgis-ui-button @click="removeEffect">删除泛光</mapgis-ui-button>
    </mapgis-ui-setting-footer>
    <!-- <mapgis-ui-button
      type="primary"
      @click="addEffect"
      :style="{ width: '100%' }"
      >执行泛光</mapgis-ui-button
    > -->
    <!-- <mapgis-ui-button
      :style="{ width: '100%', marginTop: '4px', display: 'block' }"
      @click="removeEffect"
      >删除泛光</mapgis-ui-button
    > -->
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
      lightColor: "#FF0000",
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
.mapgis-3d-m3d-menu-bloom-content {
  height: 248px;
  overflow-y: auto;
}
</style>
