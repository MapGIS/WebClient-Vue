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
    vueKey:{
      type: String,
      default: "default"
    },
    vueIndex:{
      type: Number,
      default: Number((Math.random() * 10000).toFixed(0))
    }
  },

  data () {
    return {
      initial: false,
    };
  },

  created () { },
  mounted () {
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

      //将Draw组件放入DrawToolManager
      CesiumZondy.DrawToolManager.addSource(vueKey, vueIndex, undefined, {
        entityController
      });

      //如果组件加载完毕，开放插槽
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      if (find) {
        this.initial = true;
      }

      //抛出load事件
      this.$emit("load", this);
    },

    unmount () {
      let { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      //清空实体，删除Draw组件
      if (find) {
        this.removeEntities();
        CesiumZondy.DrawToolManager.deleteSource(vueKey, vueIndex);
      }
      //抛出unload事件
      this.$emit("unload", this);
    },

    removeEntities () {
      //移除所有实体
      this.getWebGlobe();
    },
    getWebGlobe(){
      let webGlobeDraw;
      //当webSceneKey以及webSceneIndex存在时，通过这两个值寻找webGlobe
      //拥有多个webGlobe时使用
      if(this.vueKey){
        let GlobesManager = window.CesiumZondy.GlobesManager;
        webGlobeDraw = GlobesManager[this.vueKey][0].source;
      }else {
        //否则使用注入的webGlobe
        webGlobeDraw = this.webGlobe;
      }
      //取得webGlobe后，清空当前绘制
      webGlobeDraw.viewer.scene.primitives.remove(window.drawEntity);
      webGlobeDraw.viewer.entities.remove(window.drawEntity);
      return webGlobeDraw;
    },
    enableDrawPoint () {
      let webGlobeDraw = this.getWebGlobe();
      const vm = this;
      let { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController } = find.options;
      let drawElement = new Cesium.DrawElement(webGlobeDraw.viewer);
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
      let webGlobeDraw = this.getWebGlobe();
      let drawElement = new Cesium.DrawElement(webGlobeDraw.viewer),vm = this;
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
          window.drawEntity = webGlobeDraw.viewer.scene.primitives.add(polyline);
          vm.$emit('drawCreate', positions,degreeArr);
          vm.$emit('drawcreate', positions,degreeArr);
          drawElement.stopDrawing();
        }
      });
    },
    enableDrawPolygon () {
      let webGlobeDraw = this.getWebGlobe();
      let drawElement = new Cesium.DrawElement(webGlobeDraw.viewer),vm = this;
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
          window.drawEntity = webGlobeDraw.viewer.scene.primitives.add(polygon);
          vm.$emit('drawCreate', positions,degreeArr);
          vm.$emit('drawcreate', positions,degreeArr);
          drawElement.stopDrawing();
        }
      });
    },

    enableDrawRectangle(){
      let webGlobeDraw = this.getWebGlobe();
      let drawElement = new Cesium.DrawElement(webGlobeDraw.viewer),vm = this;
      drawElement.startDrawingExtent({
        callback: function (positions) {
          window.drawEntity = webGlobeDraw.viewer.entities.add({
            id:"rectangle",
            rectangle: {
              coordinates: positions,
              material: Cesium.Color.RED.withAlpha(0.5)
            }
          });
          drawElement.stopDrawing();
          let radianPoints = [positions.west,positions.north,positions.east,positions.south];
          let Cartesian3Points = Cesium.Cartesian3.fromRadiansArray(radianPoints,webGlobeDraw.ellipsoid);
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
