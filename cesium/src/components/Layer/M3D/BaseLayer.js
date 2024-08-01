import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-m3d-base-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions
  },
  data() {
    return {
      // 逻辑范围 以p4（SE）左下角为原点的局部空间范围
      logic: {
        minHeight: 0,
        maxHeight: 50,
        minWidth: 0,
        maxWidth: 50,
        minLength: 0,
        maxLength: 50
      }
    };
  },
  methods: {
    $_degreeFromCartesian(p) {
      if (!p) return;
      const { Cesium } = this;
      let point = {};
      let cartographic = Cesium.Cartographic.fromCartesian(p);
      point.longitude = Cesium.Math.toDegrees(cartographic.longitude);
      point.latitude = Cesium.Math.toDegrees(cartographic.latitude);
      point.height = cartographic.height; //模型高度
      return point;
    },
    $_getAngle(position) {
      const { Cesium } = this;
      var center = Cesium.Matrix4.multiplyByPoint(
        this.mtx,
        positions[0],
        new Cesium.Cartesian3()
      );
      var end = Cesium.Matrix4.multiplyByPoint(
        this.mtx,
        position,
        new Cesium.Cartesian3()
      );
      var newC = Cesium.Cartesian3.subtract(
        end,
        center,
        new Cesium.Cartesian3()
      );
      newC = Cesium.Cartesian3.normalize(newC, new Cesium.Cartesian3());
      var north = new Cesium.Cartesian3(0, 1, 0);
      var arc_north = Cesium.Cartesian3.dot(north, newC);
      // east用于判断与正北是否大于180度
      var east = new Cesium.Cartesian3(1, 0, 0);
      var arc_east = Cesium.Cartesian3.dot(east, end);
      var radians_north = Math.acos(arc_north);
      var dg = Cesium.Math.toDegrees(radians_north);
      if (arc_east < 0) dg = 360 - dg;
      return dg;
    },
    $_getM3DBox(m3d) {
      const { Cesium } = this;
      let result = {
        length: 0,
        width: 0,
        height: 0,
        logic: this.logic
      };
      const northeastCornerCartesian =
        m3d._root.boundingVolume.northeastCornerCartesian;
      const southwestCornerCartesian =
        m3d._root.boundingVolume.southwestCornerCartesian;
      //  NE--------------p3
      //   |              |
      //   |              |
      //   |              |
      //   p4-------------SW
      //这里：东南角和西北角在外包盒子的同一平面上
      let p1 = this.$_degreeFromCartesian(southwestCornerCartesian);
      let p2 = this.$_degreeFromCartesian(northeastCornerCartesian);
      if (!p1 || !p2) return result;
      let p3 = {},
        p4 = {};
      p3.longitude = p1.longitude;
      p3.latitude = p2.latitude;
      p3.height = p1.height;
      p4.longitude = p2.longitude;
      p4.latitude = p1.latitude;
      p4.height = p2.height;
      //p3,p4的笛卡尔坐标
      let p3Caetesian = Cesium.Cartesian3.fromDegrees(
        p3.longitude,
        p3.latitude,
        p3.height
      );
      let p4Caetesian = Cesium.Cartesian3.fromDegrees(
        p4.longitude,
        p4.latitude,
        p4.height
      );
      //求出平面的长和宽，再求出distance
      let length = Cesium.Cartesian3.distance(
        p4Caetesian,
        southwestCornerCartesian
      );
      let width = Cesium.Cartesian3.distance(
        p3Caetesian,
        southwestCornerCartesian
      );
      let height =
        m3d._root.boundingVolume.maximumHeight -
        m3d._root.boundingVolume.minimumHeight;

      this.logic.minHeight = m3d._root.boundingVolume.minimumHeight;
      this.logic.maxHeight = m3d._root.boundingVolume.maximumHeight;

      this.logic.minWidth = 0;
      this.logic.maxWidth = width;
      this.logic.minLength = 0;
      this.logic.maxlength = length;

      return result;
    }
  }
};
