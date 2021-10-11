<template>
  <div class="mapgis-widget-heightLimited-analysis">
    <mapgis-3d-draw :vue-key="vueKey" v-on:drawcreate="handleCreate" v-on:load="handleDrawLoad" :enableControl="enableControl">
        <mapgis-ui-row>
          <mapgis-ui-col :span="5">分析区域：</mapgis-ui-col>
          <mapgis-ui-col :span="19">
            <mapgis-ui-button @click="drawRectangle">绘制矩形</mapgis-ui-button>
            <mapgis-ui-button style="margin:0 8px" @click="drawPolygon">绘制面</mapgis-ui-button>
            <mapgis-ui-button @click="toggleDelete">清除</mapgis-ui-button>
          </mapgis-ui-col>
        </mapgis-ui-row>
        <mapgis-ui-row style="padding-top: 10px">
          <mapgis-ui-col :span="5">
            <span>限制高度：</span>
          </mapgis-ui-col>
          <mapgis-ui-col :span="10" style="padding-right: 8px">
            <mapgis-ui-slider v-model="heightLimit" :disabled="excavateAn" :max="maxSliderHeight" :min="mindepth" :step="5"
                      :value="parseFloat(heightLimit)" @change="setInput"/>
          </mapgis-ui-col>
          <mapgis-ui-col :span="5">
            <mapgis-ui-input-number v-model="heightLimit" :max="maxSliderHeight" :min="mindepth"
                            :style="{marginLeft: '16px'}"/>
          </mapgis-ui-col>
        </mapgis-ui-row>
    </mapgis-3d-draw>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer.js";
import Mapgis3dDraw from "../UI/Controls/Draw/Draw";
import {deepEqual} from "../../../../mapboxgl/src/components/util/util";

export default {
  name: "mapgis-3d-heightlimited",
  mixins: [ServiceLayer],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    color: {
      type: String,
      default: "#ff0000"
    },
    opacity: {
      type: Number,
      default: 0.5
    },
    maxSliderHeight: {
      type: Number,
      default: 50
    }
  },
  components: {Mapgis3dDraw},
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  data() {
    return {
      //定义
      heightLimit: 10,
      excavateAn: false,
      mindepth: 0,
      boundingSphere: "",
      waitManagerName: "M3DIgsManager",
      cartesianForHeight: [],
      enableControl:false
    }
  },
  mounted() {
    let vm = this;
    Object.keys(this.$props).forEach(function (key) {
      if (key!=="vueKey" && key!=="vueIndex"){
        vm.$watch(key,function () {
          this.heightLimitedAnalysis();
        })
      }
    })
    vm.$_init(vm.heightLimitedAnalysis);
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    heightLimit: {
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.heightLimitedAnalysis();
        }
      }
    },
    color:{
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.heightLimitedAnalysis();
        }
      }
    },
    opacity:{
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.heightLimitedAnalysis();
        }
      }
    },
    maxSliderHeight:{
      handler(next, old) {
        if (!deepEqual(next, old)) {
          this.heightLimitedAnalysis();
        }
      }
    }
  },
  methods: {
    setInput(data) {
      let vm = this;
      vm.heightLimit = data;
      vm.heightLimitedAnalysis();
    },
    removeDraw(){
      this.drawer.unmount();
    },
    drawPolygon() {
      this.drawer && this.drawer.enableDrawPolygon();
    },
    drawRectangle() {
      this.drawer && this.drawer.enableDrawRectangle();
    },
    toggleDelete() {
      this.drawer && this.drawer.removeEntities();
      this.remove();
    },
    handleDrawLoad(drawer) {
      this.drawer = drawer;
    },

    //绘制组件的回调函数
    handleCreate(cartesian3, lnglat) {
      let vm = this;
      this.drawer && this.drawer.removeEntities(true);
      vm.cartesian3 = cartesian3;
      vm.lnglat = lnglat;
      this.heightLimitedAnalysis(lnglat);
    },

    //开始控高分析
    heightLimitedAnalysis(lnglat) {
      const vm = this;
      let {vueKey, vueIndex} = this
      let {heightLimit, CesiumZondy, webGlobe} = this;
      let viewer = webGlobe.viewer;
      let findSource = vm.$_getObject();

      //先判断m3d模型是否加载完成
      if (findSource) {

        //判断分析方式，不通过绘制矩形和绘制面的方式，则lnglat为空，走if,否则绘制方式就走else
        if (!lnglat) {
          let find = CesiumZondy.HeightLimitedAnalysisManager.findSource(vueKey, vueIndex);
          if (find) {
            lnglat = find.options;
            this.remove();
          } else {
            vm._boundingVolume = findSource.source[0]._root._boundingVolume;
            const northeastCornerCartesian = vm._boundingVolume.northeastCornerCartesian;
            const southwestCornerCartesian = vm._boundingVolume.southwestCornerCartesian;
            lnglat = vm.getAllPoint(southwestCornerCartesian, northeastCornerCartesian);
          }
        } else if (lnglat.length === 2) {
          lnglat = vm.getAllPointByDegree(lnglat[0], lnglat[1]);
        } else {
          let temp = [];
          lnglat.forEach((l, index) => {
            let lTemp = {};
            lTemp.longitude = l[0];
            lTemp.latitude = l[1];
            temp[index] = lTemp;
          })
          lnglat = temp;
        }
      }

      //控高分析边界点数组
      let pnts = [];
      for (let i = 0; i < lnglat.length; i++) {
        pnts.push(new Cesium.Cartesian3(lnglat[i].longitude, lnglat[i].latitude, 0));
      }
      let cesiumColor = Cesium.Color.fromCssColorString(vm.color);

      //调用控告分析接口
      var heightLimited = new Cesium.HeightLimited(viewer, {
        height: heightLimit,
        limitedColor: cesiumColor,
        blendTransparency: vm.opacity,
        posArray: pnts,
        polygonColor: Cesium.Color.WHITE.withAlpha(0),
        useOutLine: false
      });
      webGlobe.addSceneEffect(heightLimited);

      CesiumZondy.HeightLimitedAnalysisManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          heightLimited,
          lnglat
      );
    },

    transformToLocal(cartesian3, findSource) {
      let localCertesian3 = [];
      let transform = findSource.source[0]._root.transform;
      //求逆矩阵
      const inverMatrix = Cesium.Matrix4.inverse(transform, new Cesium.Matrix4());
      //各点的相对坐标
      for (let i = 0; i < cartesian3.length; i++) {
        let point = cartesian3[i];
        let result = Cesium.Matrix4.multiplyByPoint(inverMatrix, point, new Cesium.Cartesian3());
        localCertesian3.push(result);
      }
      return localCertesian3;
    },

    //根据外包盒子两个点求出四个点
    getAllPoint(southwest, northeast) {
      let p1 = this.degreefromCartesian(southwest);
      let p2 = this.degreefromCartesian(northeast);
      let p3 = {}, p4 = {};
      p3.longitude = p1.longitude;
      p3.latitude = p2.latitude;
      p3.height = p1.height;
      p4.longitude = p2.longitude;
      p4.latitude = p1.latitude;
      p4.height = p2.height;
      //p3,p4的笛卡尔坐标
      let p3Caetesian = Cesium.Cartesian3.fromDegrees(p3.longitude, p3.latitude, p3.height);
      let p4Caetesian = Cesium.Cartesian3.fromDegrees(p4.longitude, p4.latitude, p4.height);
      let allPoint = [p1, p4, p2, p3];
      return allPoint;
    },

    //绘制方式返回的点坐标是经纬度坐标
    getAllPointByDegree(lnglat1, lnglat2) {
      let p1 = {}, p2 = {}, p3 = {}, p4 = {};
      p1.longitude = lnglat1[0];
      p1.latitude = lnglat1[1];
      p1.height = lnglat1[2];
      p2.longitude = lnglat2[0];
      p2.latitude = lnglat2[1];
      p2.height = lnglat2[2];
      p3.longitude = p1.longitude;
      p3.latitude = p2.latitude;
      p3.height = p1.height;
      p4.longitude = p2.longitude;
      p4.latitude = p1.latitude;
      p4.height = p2.height;
      let allPoint = [p1, p4, p2, p3];
      return allPoint;
    },

    //根据笛卡尔坐标求出点的经纬度坐标
    degreefromCartesian(p) {
      let point = {};
      let cartographic = Cesium.Cartographic.fromCartesian(p);
      point.longitude = Cesium.Math.toDegrees(cartographic.longitude);
      point.latitude = Cesium.Math.toDegrees(cartographic.latitude);
      point.height = cartographic.height; //模型高度
      return point;
    },

    remove() {
      const {vueKey, vueIndex} = this;
      let find = CesiumZondy.HeightLimitedAnalysisManager.findSource(vueKey, vueIndex);
      if (find && find.source) {
        find.source.remove();
      }
      // 这段代码可以认为是对应的vue的获取destroyed生命周期
      CesiumZondy.HeightLimitedAnalysisManager.deleteSource(vueKey, vueIndex);
    },
    unmount(){
      this.removeDraw();
      this.remove();
    }
  }
}

</script>

<style scoped>
::v-deep .mapgis-ui-card-body {
  max-height: 300px;
  overflow: auto;
}

.mapgis-ui-card-bordered{
  border:unset;
}

.mapgis-ui-card-body{
  padding: 10px;
}

::v-deep .mapgis-ui-col-5{
  padding-top: 8px
}
::v-deep .mapgis-ui-col-19{
  display: flex;
  padding-right: 5px;
}

.mapgis-widget-heightLimited-analysis{
  font-size: 12px;
}
</style>