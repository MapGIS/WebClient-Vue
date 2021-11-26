<template>
  <div class="mapgis-3d-m3d-menu-explosion">
    <mapgis-ui-divider>爆炸设置</mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-explosion-direction">
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(90)">
            <mapgis-ui-iconfont type="mapgis-arrow-up-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(180)">
            <mapgis-ui-iconfont type="mapgis-arrow-left-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(0)">
            <mapgis-ui-iconfont type="mapgis-arrow-right-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(-90)">
            <mapgis-ui-iconfont type="mapgis-arrow-down-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
    </div>
    <div class="mapgis-3d-m3d-menu-explosion-content">
      <mapgis-ui-input-number-panel
        size="small"
        label="朝向角度"
        v-model="headding"
        :range="[-360, 360]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        size="small"
        label="旋转角度"
        v-model="angle"
        :range="[-360, 360]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        size="small"
        label="距离"
        v-model="distance"
        :range="[-10000, 10000]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        size="small"
        label="速度"
        v-model="speed"
        :range="[0, 100]"
      >
      </mapgis-ui-input-number-panel>
    </div>
  </div>
</template>

<script>
import VueOptions from "../../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-menu-explosion",
  inject: ["Cesium", "vueCesium", "viewer", "m3ds"],
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
