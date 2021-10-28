<template>
  <div class="mapgis-3d-m3d-menu-explosion">
    <mapgis-ui-divider> 方向设置 </mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-explosion-direction">
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle">
            <mapgis-ui-iconfont type="mapgis-up-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8"
          ><mapgis-ui-button shape="circle">
            <mapgis-ui-iconfont type="mapgis-left-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle">
            <mapgis-ui-iconfont type="mapgis-right-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle">
            <mapgis-ui-iconfont type="mapgis-down-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
    <mapgis-ui-divider> 数值设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="角度设置" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="360"
          v-model="angle"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="距离设置" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="-1000000"
          :max="1000000"
          v-model="distance"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="速度设置" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="0"
          :max="100"
          v-model="speed"
        />
      </mapgis-ui-form-model-item>
    </mapgis-ui-form-model>
    <mapgis-ui-button
      type="primary"
      @click="explosionAction"
      :style="{ width: '100%' }"
      >指定单图层爆炸</mapgis-ui-button
    >
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-menu-explosion",
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
      angle: 200,
      distance: 5,
      speed: 1
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

      let explosion = this.createCesiumObject();
      explosion.then(res => {
        let modelExplosion = new Cesium.ModelExplosion(viewer);
        vueCesium.ExplosionManager.addSource(vueKey, vueIndex, this, {
          explosion: modelExplosion
        });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
      }
      this.$emit("unload", { component: this });
      vueCesium.ExplosionManager.deleteSource(vueKey, vueIndex);
    },
    explosionAction() {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const { layerIndex, viewer, m3ds, version } = this;
      const { distance, speed } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      if (!tileset) {
        return;
      }

      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let modelExplosion = find.options.explosion;
        let layer = tileset;
        //楼层基于坐标轴绕Z轴旋转了38.5
        let vectorLeft = new Cesium.Cartesian3(1, 0, 0);
        let vectorUp = new Cesium.Cartesian3(0, 1, 0);
        let vector = new Cesium.Cartesian3();
        let angle = Cesium.Math.toRadians(this.angle);
        vector.x =
          vectorLeft.x * Math.cos(angle) + vectorUp.x * Math.sin(angle);
        vector.y =
          vectorLeft.y * Math.cos(angle) + vectorUp.y * Math.sin(angle);
        vector.z =
          vectorLeft.z * Math.cos(angle) + vectorUp.z * Math.sin(angle);
        modelExplosion.multiLayerAxisExplosionWithAnimate([layer], {
          direction: vector,
          expDistance: distance,
          speed: speed
        });
      }
    }
  }
};
</script>

<style>
.mapgis-3d-m3d-menu-explosion {
  height: 100%;
  width: 100%;
}
.mapgis-3d-m3d-menu-explosion-direction {
  margin: auto;
  width: 120px;
  height: 120px;
}
</style>
