<template>
  <div :class="['excavate',{ right: position === 'right', left: position === 'left' }]">
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
    <mapgis-ui-card>
      <span slot="prefix">开挖深度:</span>
      <mapgis-ui-row :span="12">
        <mapgis-ui-slider v-model="excavateDepth" :step="10" :min="mindepth" :max="maxdepth" :disabled="excavateAn"
                  @change="setInput" :value="parseFloat(excavateDepth)"/>
      </mapgis-ui-row>
      <mapgis-ui-row :span="10">
        <mapgis-ui-input-number v-model="excavateDepth" :min="mindepth" :max="maxdepth" :style="{marginLeft: '16px'}"/>
      </mapgis-ui-row>
    </mapgis-ui-card>
  </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer.js";

export default {
  name: "mapgis-3d-excavate",
  props: {
    position: {
      type: String,
      default: "right",
    },
    planeRatio: {
      type: Number,
      default: 0.6,
    },
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
    material: {
      type: String,
      defalut: ""
    },
    edgeColor: {
      type: String,
      defalut: ""
    },
    edgeWidth: {
      type: Number,
      defalut: 3
    }
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  mixins: [ServiceLayer],
  data() {
    return {
      //定义
      excavateDepth: 0,
      excavateAn: false,
      maxdepth: 0,
      mindepth: 0,
      boundingSphere: "",
      waitManagerName: "M3DIgsManager"
    }
  },
  mounted() {
    let vm = this;
    vm.$_init(vm.getM3d);
  },
  unmount() {
    let {CesiumZondy, vueKey, vueIndex} = this;
    let find = CesiumZondy.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
    if (find) {
      let options = findSource.options;
      let source = findSource.source;
      options.forEach(o => {
        o.destroy();
      });
      source.forEach(s => {
        s.destroy();
      })
    }
    // 这段代码可以认为是对应的vue的获取destroyed生命周期
    CesiumZondy.ExcavateAnalysisManager.deleteSource(vueKey, vueIndex);
    this.$emit("unload", this);
  },
  methods: {
    getM3d() {
      let vm = this
      let {CesiumZondy, webGlobe} = this;
      let find = vm.$_getObject();
      vm._boundingVolume = find.source[0]._root._boundingVolume;
      // 模型包围盒的世界坐标系的中心、东北角、西南角
      const center = vm._boundingVolume.boundingVolume.center;
      const northeastCornerCartesian = vm._boundingVolume.northeastCornerCartesian;
      const southwestCornerCartesian = vm._boundingVolume.southwestCornerCartesian;

      //这里：东南角和西北角在外包盒子的同一平面上
      let p1 = this.degreefromCartesian(southwestCornerCartesian);
      let p2 = this.degreefromCartesian(northeastCornerCartesian);
      let centerDegree = this.degreefromCartesian(center);
      // this.drawPoint(p1);
      // this.drawPoint(p2);
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
      //求出平面的长和宽，再求出distance
      let length = Cesium.Cartesian3.distance(p4Caetesian, southwestCornerCartesian);
      let width = Cesium.Cartesian3.distance(p3Caetesian, southwestCornerCartesian);
      const beforeAfterDistance = length / 2;
      const leftRightDistance = width / 2;
      //求外包盒的高度
      let depth = Math.abs(vm._boundingVolume.maximumHeight - vm._boundingVolume.minimumHeight);
      // let depth = Math.abs(centerDegree.height - p1.height) * 2;
      //将滑动条的最大开挖深度值设置为depth
      vm.mindepth = Math.round(vm._boundingVolume.minimumHeight);
      vm.maxdepth = Math.round(vm._boundingVolume.maximumHeight);
      vm.excavateDepth = vm.maxdepth;
      //开挖面设置，原点在法向相反的方向，所以distance为负值。
      var planes = [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(vm.planeRatio, 0.0, 0.0), -beforeAfterDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(-vm.planeRatio, 0.0, 0.0), -beforeAfterDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, vm.planeRatio, 0.0), -leftRightDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -vm.planeRatio, 0.0), -leftRightDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -vm.planeRatio), -depth)
      ];
      //将获取的开挖示例放到ExcavateAnalysisManager中进行管理
      let analysisManager = new CesiumZondy.Manager.AnalysisManager({
        viewer: webGlobe.viewer
      });
      //开挖分析：
      let dynaCut = analysisManager.createExcavateAnalysis({
        //图层信息
        tileset: find.source[0],
        //开挖面的形状
        planes: planes,
        //裁剪面材质
        //Cesium.Color.fromCssColorString(_textColor)
        material: new Cesium.Color(0.2, 0.4, 0.3, 0.7),
        //边界线颜色
        edgeColor: new Cesium.Color(0.2, 0.4, 0.3, 0.7),
        //边界线宽度
        edgeWidth: vm.edgeWidth,
        //裁减法线方向，默认值为 false
        unionClippingRegions: false,
        //开挖坐标
        longitude: centerDegree.longitude,
        latitude: centerDegree.latitude,
        height: centerDegree.height + depth/2
      });
      CesiumZondy.ExcavateAnalysisManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          dynaCut,
          {planes}
      );
      this.$emit("load", vm);

      dynaCut.planes[0].plane.plane = new Cesium.CallbackProperty(function (date) {
        for (var i = 0; i < planes.length; i++) {
          if (i === planes.length - 1) {
            var plane = planes[i];
            plane.distance = vm.excavateDepth;
            Cesium.Plane.transform(plane, find.source[0].modelMatrix, new Cesium.ClippingPlane(Cesium.Cartesian3.UNIT_X, 0.0));
          }
        }
      }, false);
    },
    drawPoint(p) {
      let {CesiumZondy,webGlobe} = this;
      let entityController = new CesiumZondy.Manager.EntityController({
        viewer: webGlobe.viewer
      });
      //填充颜色
      var fillColor = new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1);
      //边线颜色
      var outLineColor = new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 1);

      let point1 = entityController.appendPoint(
          p.longitude, p.latitude, p.height,
          '外包盒上的点',
          12,
          fillColor,
          outLineColor,
          2
      );
    },
    degreefromCartesian(p) {
      let point = {};
      let cartographic = Cesium.Cartographic.fromCartesian(p);
      point.longitude = Cesium.Math.toDegrees(cartographic.longitude);
      point.latitude = Cesium.Math.toDegrees(cartographic.latitude);
      point.height = cartographic.height; //模型高度
      return point;
    },
    setInput(data) {
      let {excavateDepth} = this;
      excavateDepth = data;
    }
  }
}
</script>

<style scoped>
::v-deep .ant-card-body {
  max-height: 300px;
  overflow: auto;
}

.excavate.right {
  position: absolute;
  top: 20px;
  right: 20px;
}

.excavate.left {
  position: absolute;
  top: 20px;
  left: 20px;
}

</style>