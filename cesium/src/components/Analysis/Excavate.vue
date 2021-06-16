<template>
  <div :class="['skyl',{ right: position === 'right', left: position === 'left' }]">
    <div
        class="card-title"
        :style="{
                background: 'rgb(38, 151, 204)',
                padding: '5px',
                color: 'white',
            }"
    >
      开挖分析
    </div>
    <a-card>
    <div class="inputs">
      <a-input v-model="excavateDepth" :disabled="!excavateDepth">
        <span slot="prefix">开挖深度:</span>
      </a-input>
      <a-slider
          class="input"
          :step="10"
          :max="maxdepth"
          :min="mindepth"
          :disabled="!excavateDepth"
          :value="parseFloat(excavateDepth)"
          @change="setInput"
      />
    </div>
    </a-card>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer.js";

export default {
  name: "mapgis-3d-excavate",
  props: {
    index: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "right",
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  mixins: [ServiceLayer],
  data() {
    return {
      //定义
      excavateDepth: 0,
      maxdepth: 0,
      mindepth: 0,
      boundingSphere: "",
      waitManagerName: "M3DIgsManager"
    }
  },
  mounted() {
    let vm = this;
    vm.$_init(vm.getM3d);
    window.excavateAnl = window.excavateAnl || [[], []];
  },
  destroyed() {
    // const { webGlobe } = this;
    // let find = this.findSource();
    // webGlobe.viewer.scene.VisualAnalysisManager.remove(
    //     window.excavateAnl[this.index][find.index]
    // );
    // delete window.excavateAnl;
    // window.excavateAnl = [[], []];
  },
  methods: {
    getM3d() {
      let vm = this
      let {CesiumZondy,webGlobe} = this;
      let find = vm.$_getObject();
      console.log(find);
      let tileset = webGlobe.viewer.scene.primitives;
      console.log("tileset",tileset);
      vm.boundingSphere = find.source[0].boundingSphere;
      vm.boundingVolume = find.source[0]._root._boundingVolume.boundingVolume;
      //获取外包球的中心到右上角，左下角的坐标
      //boundingSphere.center(笛卡尔集)
      // x: -2162874.792067819
      // y: 5083359.752926046
      // z: 3172285.7413794524
      //boundingSphere.radius(Number): 6431.75322250587
      //根据tileset的边界球体中心点的笛卡尔坐标得到经纬度坐标
      var cartographic = Cesium.Cartographic.fromCartesian(vm.boundingVolume.center);
      console.log(cartographic);
    },

    startExcavate() {
      let that = this;
      let viewer = that.webGlobe.viewer;
      viewer.scene.globe.depthTestAgainstTerrain = true;

      viewer.scene.globe.enableTransparent = false;

    },
    clearExcavate() {
      let that = this;
      let viewer = that.webGlobe.viewer;
    },
    setInput(data) {
      this.excavate = data;
    }
  }
}
</script>

<style scoped>
.skyl .right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.skyl .left {
  position: absolute;
  top: 20px;
  left: 20px;
}

::v-deep .ant-card-body {
  max-height: 300px;
  overflow: auto;
}
</style>