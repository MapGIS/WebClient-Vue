<template>
  <div class="mapgis-widget-excavate-analysis">
    <mapgis-ui-group-tab title="参数设置"></mapgis-ui-group-tab>
    <mapgis-ui-setting-form :wrapper-width="160">
      <mapgis-ui-form-item label="裁剪面材质">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="materialCopy"
            @input="
            val =>
              (materialCopy = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="边界线颜色">
        <mapgis-ui-sketch-color-picker
            :disableAlpha="false"
            :color="edgeColorCopy"
            @input="
            val =>
              (edgeColorCopy = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`)
          "
        ></mapgis-ui-sketch-color-picker>
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="边界线宽度（米）">
        <mapgis-ui-input
            v-model.number="edgeWidthCopy"
            :min="0"
            type="number"
        />
      </mapgis-ui-form-item>
      <mapgis-ui-form-item label="开挖深度(米)">
        <mapgis-ui-slider v-model="excavateDepth" :step="10" :min="mindepth" :max="maxdepth" :disabled="excavateAn"
                          @change="setInput" :value="parseFloat(excavateDepth)"/>
        <mapgis-ui-input-number v-model="excavateDepth" :min="mindepth" :max="maxdepth" :style="{marginLeft: '16px'}"/>
      </mapgis-ui-form-item>
    </mapgis-ui-setting-form>
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
    excaveteStyle: {
      type: Object,
      default() {
        return {
          material: "#00FFFF",
          edgeColor: "#FF8C00",
          edgeWidth: 3
        }
      }
    }
  },
  inject: ["Cesium", "CesiumZondy", "viewer"],
  mixins: [ServiceLayer],
  data() {
    return {
      //定义
      excavateDepth: 0,
      excavateAn: false,
      maxdepth: 0,
      mindepth: 0,
      boundingSphere: "",
      waitManagerName: "M3DIgsManager",
      materialCopy: "#00FFFF",
      edgeColorCopy: "#FF8C00",
      edgeWidthCopy: 3,
      //开挖面对象
      planes: "",
      //开挖中心坐标
      centerDegree: "",
      initial: true,
      //模型外包盒的高度
      depth: undefined
    }
  },
  watch: {
    excaveteStyle: {
      handler: function (newVal, oldVal) {
        this.materialCopy = newVal.material;
        this.edgeColorCopy = newVal.edgeColor;
        this.edgeWidthCopy = newVal.edgeWidth;
        if (!this.initial) {
          this.unmount();
          this.startExcavate();
        }
      },
      immediate: true
    },
    materialCopy() {
      if (!this.initial) {
        this.unmount();
        this.startExcavate();
      }
    },
    edgeColorCopy() {
      if (!this.initial) {
        this.unmount();
        this.startExcavate();
      }
    },
    edgeWidthCopy() {
      if (!this.initial) {
        this.unmount();
        this.startExcavate();
      }
    },
  },
  mounted() {
    let vm = this;
    vm.$_init(vm.getM3d);
  },

  methods: {
    getM3d() {
      let vm = this
      let { Cesium } = this;
      let find = vm.$_getObject();
      vm._boundingVolume = find.source[0]._root._boundingVolume;
      // 模型包围盒的世界坐标系的中心、东北角、西南角
      const center = vm._boundingVolume.boundingVolume.center;
      const northeastCornerCartesian = vm._boundingVolume.northeastCornerCartesian;
      const southwestCornerCartesian = vm._boundingVolume.southwestCornerCartesian;

      //这里：东南角和西北角在外包盒子的同一平面上
      let p1 = this.degreefromCartesian(southwestCornerCartesian);
      let p2 = this.degreefromCartesian(northeastCornerCartesian);
      vm.centerDegree = this.degreefromCartesian(center);
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
      vm.depth = Math.abs(vm._boundingVolume.maximumHeight - vm._boundingVolume.minimumHeight);
      // let depth = Math.abs(centerDegree.height - p1.height) * 2;
      //将滑动条的最大开挖深度值设置为depth
      vm.mindepth = Math.round(vm._boundingVolume.minimumHeight);
      vm.maxdepth = Math.round(vm._boundingVolume.maximumHeight);
      vm.excavateDepth = vm.maxdepth;
      //开挖面设置，原点在法向相反的方向，所以distance为负值。
      vm.planes = [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(vm.planeRatio, 0.0, 0.0), -beforeAfterDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(-vm.planeRatio, 0.0, 0.0), -beforeAfterDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, vm.planeRatio, 0.0), -leftRightDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -vm.planeRatio, 0.0), -leftRightDistance),
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -vm.planeRatio), -vm.depth)
      ];
      vm.startExcavate();
    },
    /**
     * 开始开挖分析
     */
    startExcavate() {
      let vm = this;
      vm.initial = false;
      let {CesiumZondy, viewer} = this;
      let find = vm.$_getObject();

      //初始化开挖实例
      let material = Cesium.Color.fromCssColorString(vm.materialCopy);
      material = Cesium.Color.fromAlpha(material, 0.7);
      let edgeColor = Cesium.Color.fromCssColorString(vm.edgeColorCopy);
      edgeColor = Cesium.Color.fromAlpha(edgeColor, 0.7);

      let dynaCut = this.createExcavateAnalysis({
        //图层信息
        tileset: find.source[0],
        //开挖面的形状
        planes: vm.planes,
        //裁剪面材质
        //new Cesium.Color(0.2, 0.4, 0.3, 0.7)
        material: material,
        //边界线颜色
        edgeColor: edgeColor,
        //边界线宽度
        edgeWidth: vm.edgeWidthCopy,
        //裁减法线方向，默认值为 false
        unionClippingRegions: false,
        //开挖坐标
        longitude: vm.centerDegree.longitude,
        latitude: vm.centerDegree.latitude,
        height: vm.centerDegree.height + vm.depth / 2
      });

      CesiumZondy.ExcavateAnalysisManager.addSource(
          vm.vueKey,
          vm.vueIndex,
          dynaCut,
          vm.planes
      );
      this.$emit("load", vm);

      dynaCut.planes[0].plane.plane = new Cesium.CallbackProperty(function (date) {
        for (var i = 0; i < vm.planes.length; i++) {
          if (i === vm.planes.length - 1) {
            var plane = vm.planes[i];
            plane.distance = vm.excavateDepth;
            Cesium.Plane.transform(plane, find.source[0].modelMatrix, new Cesium.ClippingPlane(Cesium.Cartesian3.UNIT_X, 0.0));
          }
        }
      }, false);
    },

    /**
     * 开挖
     * @function module:客户端可视化分析.AnalysisManager.prototype.createExcavateAnalysis
     * @param {Object} options 开挖参数
     * @param {Object} options.tileset 图层信息
     * @param {Object} options.planes 开挖面的形状
     * @param {Object} [options.material] 裁剪面材质
     * @param {Color} [options.edgeColor] 边界线颜色
     * @param {Number} [options.edgeWidth] 边界线宽度
     * @param {Boolean} [options.unionClippingRegions] 裁减法线方向，默认值为 false
     * @param {Number} options.longitude 开挖面定位点经度
     * @param {Number} options.latitude 开挖面定位点纬度
     * @param {Number} [options.height] 开挖面定位点高度
     */
    createExcavateAnalysis(options) {
      if (!Cesium.defined(options.tileset) || !Cesium.defined(options.planes)) {
        return undefined;
      }
      const { tileset } = options;
      const { planes } = options;
      const material = Cesium.defaultValue(options.material, Cesium.Color.WHITE.withAlpha(0.02));
      const edgeColor = Cesium.defaultValue(options.edgeColor, Cesium.Color.RED);
      const edgeWidth = Cesium.defaultValue(options.edgeWidth, 0);
      const unionClippingRegions = Cesium.defaultValue(options.unionClippingRegions, false);
      const { longitude } = options;
      const { latitude } = options;
      const height = Cesium.defaultValue(options.height, 0.0);
      const { transform } = tileset._root;
      const rotation = new Cesium.Matrix3();
      Cesium.Matrix4.getMatrix3(transform, rotation);
      const scale = new Cesium.Cartesian3();
      Cesium.Matrix4.getScale(transform, scale);
      const center = new Cesium.Cartesian3();
      Cesium.Matrix4.getTranslation(transform, center);
      let modelMatrix = transform.clone();
      if (Cesium.defined(longitude) && Cesium.defined(latitude)) {
        modelMatrix = this.getTransForm(transform, longitude, latitude, height);
      }
      tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
        modelMatrix,
        planes,
        edgeColor,
        edgeWidth,
        unionClippingRegions
      });
      const planeEntityArray = [];
      const { radius } = tileset.boundingSphere;
      for (let i = 0; i < planes.length; i += 1) {
        const planeEntity = this.viewer.entities.add({
          position: center,
          plane: {
            dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
            material
          }
        });
        planeEntityArray.push(planeEntity);
      }
      return {
        tileset,
        planes: planeEntityArray
      };
    },

    getTransForm(transform, lo, la, height) {
      // let { Cesium } = this;
      let position = Cesium.Cartographic.toCartesian(Cesium.Cartographic.fromDegrees(lo, la, height));
      let matrix = new Cesium.Matrix4();
      matrix = Cesium.Matrix4.inverse(transform, matrix);
      position = Cesium.Matrix4.multiplyByPoint(matrix, position, position);
      const center = new Cesium.Cartesian3(0.0, 0.0, 0.0);
      Cesium.Cartesian3.subtract(position, center, position);
      Cesium.Matrix4.fromTranslation(position, matrix);
      return matrix;
    },

    drawPoint(p) {
      let {CesiumZondy, viewer} = this;
      let entityController = new CesiumZondy.Manager.EntityController({
        viewer: viewer
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
    },
    unmount() {
      let {CesiumZondy, vueKey, vueIndex} = this;
      let find = CesiumZondy.ExcavateAnalysisManager.findSource(vueKey, vueIndex);
      if (find) {
        let source = find.source;
        // this.webGlobe.deleteDynamicCutting(source);
      }
      // 这段代码可以认为是对应的vue的获取destroyed生命周期
      CesiumZondy.ExcavateAnalysisManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
  }
}
</script>

<style scoped>
.mapgis-widget-excavate-analysis {
  font-size: 12px;
  width: fit-content;
}

</style>