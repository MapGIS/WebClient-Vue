<template>
  <div class="mapgis-3d-m3d-menu-explosion">
    <mapgis-ui-divider style="fontsize: 14px">爆炸设置</mapgis-ui-divider>
    <div class="mapgis-3d-m3d-menu-explosion-direction">
      <mapgis-ui-row>
        <mapgis-ui-col :span="8" :offset="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(90)">
            <mapgis-ui-iconfont type="mapgis-arrow-up-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
      </mapgis-ui-row>
      <mapgis-ui-row :style="{ margin: '8px 0px' }">
        <mapgis-ui-col :span="8"
          ><mapgis-ui-button shape="circle" @click="() => changeHeadding(180)">
            <mapgis-ui-iconfont type="mapgis-arrow-left-filling" />
          </mapgis-ui-button>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8"
          ><mapgis-ui-button shape="circle" @click="() => resetHeadding()">
            <mapgis-ui-iconfont type="mapgis-redo" />
          </mapgis-ui-button>
        </mapgis-ui-col>
        <mapgis-ui-col :span="8"
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
        transparent
        size="large"
        label="距离"
        v-model="distance"
        :range="[-100, 100]"
      >
      </mapgis-ui-input-number-panel>
      <mapgis-ui-input-number-panel
        transparent
        size="large"
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
      type: String,
    },
    layerIndex: {
      type: Number,
    },
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
      moveDirection: undefined,
      ordinal: 0,
      deltaDistance: 1,
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
        (resolve) => {
          resolve();
        },
        (reject) => {}
      );
    },
    mount() {
      const vm = this;
      const { Cesium, vueIndex, vueKey, vueCesium } = this;
      const { viewer } = this;
      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.ExplosionManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
      }
      this.$emit("unload", { component: this });
      vueCesium.ExplosionManager.deleteSource(vueKey, vueIndex);
      this.resetHeadding();
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
      let layer = tileset;
      //楼层基于坐标轴绕Z轴旋转了38.5
      let vectorLeft = new Cesium.Cartesian3(1, 0, 0);
      let vectorUp = new Cesium.Cartesian3(0, 1, 0);
      let vector = new Cesium.Cartesian3();
      let angle = Cesium.Math.toRadians(this.angle);
      vector.x = vectorLeft.x * Math.cos(angle) + vectorUp.x * Math.sin(angle);
      vector.y = vectorLeft.y * Math.cos(angle) + vectorUp.y * Math.sin(angle);
      vector.z = vectorLeft.z * Math.cos(angle) + vectorUp.z * Math.sin(angle);
      this.multiLayerAxisExplosionWithAnimate([layer], {
        direction: vector,
        expDistance: distance,
        speed: speed,
      });
    },
    multiLayerAxisExplosionWithAnimate(M3DSets, options) {
      const { Cesium } = this;
      const optionsParam = options || {};
      const moveDirection =
        optionsParam.direction || new Cesium.Cartesian3(1, 0, 0);
      for (let index = 0; index < M3DSets.length; index++) {
        const l = M3DSets[index];
        const temp = l.root.transform.clone();
        l.root.originTransform = l.root.originTransform || temp;
      }
      const explosion = {
        directions: [],
        layers: M3DSets,
        viewer: this.viewer,
        expDistance: optionsParam.expDistance || 1,
        speed: optionsParam.speed || 1,
      };
      const layers = M3DSets;
      if (layers.length === 1) {
        this.ordinal = 1;
      }
      const originPoint = new Cesium.Cartesian3(0, 0, 0);
      const direction = new Cesium.Cartesian3();
      Cesium.Matrix4.multiplyByPoint(
        layers[0].root.transform,
        originPoint,
        originPoint
      );
      Cesium.Matrix4.multiplyByPoint(
        layers[0].root.transform,
        moveDirection,
        moveDirection
      ); //此处direction为方向点
      Cesium.Cartesian3.subtract(moveDirection, originPoint, direction);
      Cesium.Cartesian3.normalize(direction, direction);
      for (let i = 0; i < layers.length; i++) {
        explosion.directions.push(direction);
        const layer = layers[i];
        const transform = layer.root.transform.clone();
      }
      this.deltaDistance = 0;
      this.viewer.clock.onTick.addEventListener(this.clockMulti(explosion));
    },
    /**
     * 实现爆炸动画效果的时钟监听事件
     * @private
     */
    clockMulti(explosion) {
      if (!explosion) {
        return;
      }
      const { Cesium } = this;
      const { viewer, expDistance, layers, directions } = explosion;
      let { speed } = explosion;
      this.deltaDistance += speed;
      if (this.deltaDistance > expDistance) {
        speed = expDistance % speed;
      }
      for (let i = 0; i < layers.length; i++) {
        const direction = directions[i];
        const distance = speed * this.ordinal;
        const layer = layers[i];
        let transform = layer.root.transform.clone();
        const tempDirection = direction.clone();
        Cesium.Cartesian3.multiplyByScalar(direction, distance, tempDirection);
        transform[12] += tempDirection.x;
        transform[13] += tempDirection.y;
        transform[14] += tempDirection.z;
        // 设置矩阵
        layer.root.transform = transform.clone();
        this.ordinal++;
      }
      if (this.deltaDistance > expDistance) {
        viewer.clock.onTick.removeEventListener(this.clockMulti());
      }
      this.ordinal = 0;
      if (layers.length === 1) {
        this.ordinal = 1;
      }
    },
    changeHeadding(rotate) {
      this.angle = this.headding + rotate;
      this.explosionAction();
    },
    resetHeadding() {
      const { layerIndex, viewer, m3ds } = this;
      const { vueKey, vueIndex, vueCesium } = this;
      let tileset;
      if (m3ds) {
        tileset = m3ds[layerIndex];
      } else {
        tileset = viewer.scene.layers.getM3DLayer(layerIndex);
      }
      if (!tileset) {
        return;
      }
      this.removeModelExplosion([tileset]);
    },
    /**
     * 重置图层
     */
    removeModelExplosion(m3dSets) {
      for (let i = 0; i < m3dSets.length; i++) {
        var layer = m3dSets[i];
        layer.root.transform = layer.root.originTransform;
      }
    },
  },
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
