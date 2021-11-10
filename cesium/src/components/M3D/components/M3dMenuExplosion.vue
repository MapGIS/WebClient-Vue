<template>
  <div class="mapgis-3d-m3d-menu-explosion">
    <mapgis-ui-divider> 方向设置 </mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-explosion-direction">
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(90)">
            <mapgis-ui-iconfont type="mapgis-up-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(180)">
            <mapgis-ui-iconfont type="mapgis-left-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(0)">
            <mapgis-ui-iconfont type="mapgis-right-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(-90)">
            <mapgis-ui-iconfont type="mapgis-down-circle" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
    <!-- <mapgis-ui-button @click="handleDrawDirection">
      激活绘制方向
    </mapgis-ui-button> -->
    <mapgis-ui-divider> 数值设置 </mapgis-ui-divider>
    <mapgis-ui-form-model
      :layout="layout"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      labelAlign="left"
    >
      <mapgis-ui-form-model-item label="朝向角度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="-360"
          :max="360"
          v-model="headding"
        />
      </mapgis-ui-form-model-item>
      <mapgis-ui-form-model-item label="旋转角度" required>
        <mapgis-ui-input-number
          :style="{ width: '100%' }"
          size="small"
          :min="-360"
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
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
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
      headding: 0,
      angle: 0,
      distance: 5,
      speed: 1,
      moveDirection: undefined
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
      const { distance, speed, moveDirection } = this;
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
        // vector = vector;
        modelExplosion.multiLayerAxisExplosionWithAnimate([layer], {
          direction: vector,
          expDistance: distance,
          speed: speed
        });
      }
    },
    handleDrawDirection() {
      const vm = this;
      const { viewer } = this;
      let drawElement = new Cesium.DrawElement(viewer);
      drawElement.startDrawingPolyline({
        color: new Cesium.Color(0.3, 0.7, 0.8, 1.0),
        callback: function(result) {
          console.warn("pos", result);
          // vm.moveDirection = result.positions;
          var polyline = new Cesium.DrawElement.PolylinePrimitive({
            positions: result.positions,
            width: 1,
            geodesic: true
          });
          scene.primitives.add(polyline);
          polyline.setEditable();
          primitivesList.push(polyline);
        }
      });
    },
    changeHeadding(rotate) {
      this.angle = this.headding + rotate;
      this.explosionAction();
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
