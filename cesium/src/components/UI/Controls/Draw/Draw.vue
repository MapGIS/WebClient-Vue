<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="initial" />
  </div>
</template>

<style></style>

<script>
const drawEvents = {
  // es6
  drawCreate: "draw.create",
  // brower
  drawcreate: "draw.create",
}
export default {
  name: "mapgis-3d-draw",
  mixins: [],
  inject: ["Cesium", "CesiumZondy", "webGlobe"],

  props: {
  },

  data () {
    return {
      initial: false,
    };
  },

  created () { },
  mounted () {
    window.drawEntity = undefined;
    this.mount();
  },
  destroyed () {
    this.unmount();
  },
  watch: {},
  methods: {
    mount () {
      const { webGlobe, vueIndex, vueKey } = this;
      const { viewer } = webGlobe;
      //构造几何绘制控制对象
      let entityController = new CesiumZondy.Manager.EntityController({
        viewer: viewer
      });

      CesiumZondy.DrawToolManager.addSource(vueKey, vueIndex, undefined, {
        entityController
      });

      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      if (find) {
        this.initial = true;
      }

      this.$emit("load", this);
    },

    unmount () {
      let { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      if (find) {
        this.removeEntities();
        CesiumZondy.DrawToolManager.deleteSource(vueKey, vueIndex);
      }
      this.$emit("unload", this);
    },

    removeEntities () {
      //移除所有实体
      webGlobe.viewer.scene.primitives.remove(window.drawEntity);
      webGlobe.viewer.entities.remove(window.drawEntity);
    },

    enableDrawPoint () {
      webGlobe.viewer.scene.primitives.remove(window.drawEntity);
      webGlobe.viewer.entities.remove(window.drawEntity);
      const vm = this;
      let { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController } = find.options;
      let drawElement = new Cesium.DrawElement(webGlobe.viewer);
      drawElement.startDrawingMarker({
        addDefaultMark: false,
        callback: function (position) {
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let height = cartographic.height; //模型高度
          //添加点：经度、纬度、高程、名称、像素大小、颜色、外边线颜色、边线宽度
          window.drawEntity = entityController.appendPoint(lng, lat, height, '点', 10,
              new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 1),
              new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1),
              2);
          drawElement.stopDrawing();
          vm.$emit('drawCreate', position, [lng, lat, height]);
          vm.$emit('drawcreate', position, [lng, lat, height]);
        }
      });
    },

    enableDrawLine () {
      webGlobe.viewer.scene.primitives.remove(window.drawEntity);
      webGlobe.viewer.entities.remove(window.drawEntity);
      let drawElement = new Cesium.DrawElement(webGlobe.viewer),vm = this;
      drawElement.startDrawingPolyline({
        callback: function (positions) {
          positions.splice(positions.length - 1,1);
          let degreeArr = [];
          for (let i = 0;i < positions.length;i++){
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            degreeArr.push([lng,lat,height]);
          }
          let polyline = new Cesium.DrawElement.PolylinePrimitive({
            id:"polyline",
            positions: positions,
            width: 1,
            geodesic: true
          });
          window.drawEntity = webGlobe.viewer.scene.primitives.add(polyline);
          vm.$emit('drawCreate', positions,degreeArr);
          vm.$emit('drawcreate', positions,degreeArr);
          polyline.setEditable();
          drawElement.stopDrawing();
        }
      });
    },
    enableDrawPolygon () {
      webGlobe.viewer.scene.primitives.remove(window.drawEntity);
      webGlobe.viewer.entities.remove(window.drawEntity);
      let drawElement = new Cesium.DrawElement(webGlobe.viewer),vm = this;
      drawElement.startDrawingPolygon({
        callback: function (positions) {
          let degreeArr = [];
          for (let i = 0;i < positions.length;i++){
            let cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            degreeArr.push([lng,lat,height]);
          }
          let polygon = new Cesium.DrawElement.PolygonPrimitive({
            positions: positions,
            material: Cesium.Material.fromType('Color', {
              color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
            }),
          });
          window.drawEntity = webGlobe.viewer.scene.primitives.add(polygon);
          vm.$emit('drawCreate', positions,degreeArr);
          vm.$emit('drawcreate', positions,degreeArr);
          drawElement.stopDrawing();
        }
      });
    },

    enableDrawRectangle(){
      webGlobe.viewer.scene.primitives.remove(window.drawEntity);
      webGlobe.viewer.entities.remove(window.drawEntity);
      let drawElement = new Cesium.DrawElement(webGlobe.viewer),vm = this;
      drawElement.startDrawingExtent({
        callback: function (positions) {
          window.drawEntity = webGlobe.viewer.entities.add({
            id:"rectangle",
            rectangle: {
              coordinates: positions,
              material: Cesium.Color.RED.withAlpha(0.5)
            }
          });
          drawElement.stopDrawing();
          let radianPoints = [positions.west,positions.north,positions.east,positions.south];
          let Cartesian3Points = Cesium.Cartesian3.fromRadiansArray(radianPoints,webGlobe.ellipsoid);
          let degreeArr = [];
          for (let i = 0;i < Cartesian3Points.length;i++){
            let cartographic = Cesium.Cartographic.fromCartesian(Cartesian3Points[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            degreeArr.push([lng,lat,height]);
          }
          vm.$emit('drawCreate', Cartesian3Points,degreeArr);
          vm.$emit('drawcreate', Cartesian3Points,degreeArr);
        }
      });
    }
  }
};
</script>
