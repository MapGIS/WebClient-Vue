<template>
  <div class="mapgis-3d-m3d-menu-searchlight">
    <mapgis-ui-divider> 探照灯设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="激活探照灯" required>
        <mapgis-ui-tooltip
          title="点击第一次设置灯光位置，点击第二次设置灯光的方向"
        >
          <mapgis-ui-button type="primary" size="small" @click="handleDraw">
            交互绘制激活</mapgis-ui-button
          >
        </mapgis-ui-tooltip>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="颜色" required>
        <mapgis-ui-button size="small">
          <mapgis-ui-color-picker v-model="searchlightColor" />
        </mapgis-ui-button>
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="混合系数" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="100000"
          v-model="mixFactor"
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
      <mapgis-ui-form-model-item label="类型" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="1000000"
          v-model="type"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="宽度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :step="0.1"
          :min="0"
          :max="1000000"
          v-model="width"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>

    <mapgis-ui-button
      type="primary"
      @click="addEffect"
      :style="{ width: '100%' }"
      >执行探照灯</mapgis-ui-button
    >
    <mapgis-ui-button
      :style="{ width: '100%', marginTop: '4px' }"
      @click="removeEffect"
      >删除探照灯</mapgis-ui-button
    >
  </div>
</template>

<script>
import BaseLayer from "../BaseLayer";

export default {
  name: "mapgis-3d-m3d-menu-searchlight",
  inject: ["Cesium", "CesiumZondy", "vueCesium", "viewer", "m3ds"],
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
      direction: 1.0,
      searchlightColor: "rgb(0.38, 0.88, 0.92)",
      mixFactor: 0.9,
      duration: 5000,
      type: 2.0,
      width: 5
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

      let searchlight = this.createCesiumObject();
      searchlight.then(res => {
        vueCesium.SearchLightManager.addSource(vueKey, vueIndex, this, {
          lines: []
        });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeEffect();
      this.$emit("unload", { component: this });
      vueCesium.SearchLightManager.deleteSource(vueKey, vueIndex);
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
      const { searchlightColor, mixFactor, duration, type, width } = this;

      let tileset = this.getM3DSet();
      if (!tileset) return;

      this.removeEffect();
      var lightPosition = new Cesium.Cartesian3(-2005887, 4964532, 3454029);
      var directionPosition = new Cesium.Cartesian3(-2005886, 4964528, 3454026);

      let searchlight = new Cesium.SearchlightEffect(
        viewer,
        lightPosition,
        directionPosition,
        tileset.root.transform,
        {
          lightColor: new Cesium.Color.fromCssColorString(searchlightColor),
          mixFactor,
          duration,
          type,
          width
        }
      );

      searchlight.add();
      vueCesium.SearchLightManager.changeOptions(
        vueKey,
        vueIndex,
        "searchlight",
        searchlight
      );
    },
    removeEffect() {
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.SearchLightManager.findSource(vueKey, vueIndex);
      if (find && find.options && find.options.searchlight) {
        let searchlight = find.options.searchlight;
        searchlight.remove && searchlight.remove();
      }
    },
    handleDraw() {
      const vm = this;
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { searchlightColor } = this;
      let drawElement = new Cesium.DrawElement(viewer);
      drawElement.startDrawingPolyline({
        color: new Cesium.Color.fromCssColorString(searchlightColor),
        callback: function(result) {
          const { positions } = result;
          if (positions && positions.length >= 2) {
            drawElement.stopDrawing();
          }
          var polyline = new Cesium.DrawElement.PolylinePrimitive({
            positions: result.positions,
            width: 1,
            geodesic: true
          });
          viewer.scene.primitives.add(polyline);
          polyline.setEditable();
        }
      });
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-searchlight {
  height: 100%;
  width: 100%;
}
</style>
