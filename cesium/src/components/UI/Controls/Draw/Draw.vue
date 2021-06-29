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
    infinite: {
      type: Boolean,
      default: false
    },
    vueKey:{
      type: String,
      default: ""
    },
    vueIndex:{
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },

  data () {
    return {
      initial: false,
      drawOption:""
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
      let vm = this;
      const {vueKey,vueIndex} = this;
      //轮询，知道webGlobe有值，才会显示slot，这是为了保证draw组件不在webscene组件里面也能正常使用
      let interval = setInterval(function () {
        let webGlobe = vm.getWebGlobe();
        if(webGlobe){
          clearInterval(interval);
          vm.initial = true;
          vm.$emit("load",vm);
          window.CesiumZondy.DrawToolManager.addSource(
              vueKey,
              vueIndex,
              []
          );
        }
      },50);
    },

    unmount () {
      let { vueKey, vueIndex, CesiumZondy } = this;
      if(!CesiumZondy){
        CesiumZondy = window.CesiumZondy;
      }
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      //清空实体，删除Draw组件
      if (find) {
        this.removeEntities(true);
        CesiumZondy.DrawToolManager.deleteSource(vueKey, vueIndex);
      }
      //清空drawElement
      if(window.drawElement){
        window.drawElement.stopDrawing();
      }
      delete window.drawElement;
      //抛出unload事件
      this.$emit("unload", this);
    },

    removeEntities (unmount) {
      //移除所有实体
      this.getWebGlobe();
      if(!unmount){
        if(this.drawOption.length > 0){
          this[this.drawOption]();
        }
      }
    },
    getWebGlobe(){
      let webGlobeDraw;
      let {webGlobe,CesiumZondy,Cesium,vueKey,vueIndex} = this;
      if(!CesiumZondy){
        CesiumZondy = window.CesiumZondy;
      }
      if(!Cesium){
        Cesium = window.Cesium;
      }
      //当webGlobe存在，则表示在web-scene组建中，使用注入的webGlobe
      if(this.vueKey.length === 0){
        webGlobeDraw = webGlobe;
      }else {
        //当webGlobe不存在，则表示要通过vueKey获取
        let GlobesManager = CesiumZondy.GlobesManager;
        if(GlobesManager.hasOwnProperty(this.vueKey) && GlobesManager[this.vueKey].length > 0 && GlobesManager[this.vueKey][0].hasOwnProperty("source")){
          webGlobeDraw = GlobesManager[this.vueKey][0].source;
        }
      }
      //取得webGlobe后，清空当前绘制
      if(webGlobeDraw){
        let drawEntities = window.CesiumZondy.DrawToolManager.findSource(vueKey,vueIndex);
        if(drawEntities){
          drawEntities = drawEntities.source;
          for (let i = 0;i < drawEntities.length;i++){
            webGlobeDraw.viewer.scene.primitives.remove(drawEntities[i]);
            webGlobeDraw.viewer.entities.remove(drawEntities[i]);
          }
          drawEntities.source = [];
        }
        if(window.drawElement){
          window.drawElement.stopDrawing();
        }
      }
      return webGlobeDraw;
    },
    getDrawElement(webGlobe){
      if (window.drawElement){
        window.drawElement.stopDrawing();
      }
      window.drawElement = new Cesium.DrawElement(webGlobe.viewer);
      return window.drawElement;
    },
    enableDrawPoint () {
      this.drawOption = "enableDrawPoint";
      let webGlobeDraw = this.getWebGlobe();
      const vm = this;
      let { CesiumZondy,Cesium,vueKey,vueIndex } = this;
      if(!CesiumZondy){
        CesiumZondy = window.CesiumZondy;
      }
      if(!Cesium){
        Cesium = window.Cesium;
      }
      let entityController = new CesiumZondy.Manager.EntityController({
        viewer: webGlobeDraw.viewer
      });
      let drawElement = this.getDrawElement(webGlobeDraw);
      drawElement.startDrawingMarker({
        addDefaultMark: false,
        callback: function (position) {
          let cartographic = Cesium.Cartographic.fromCartesian(position);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let height = cartographic.height; //模型高度
          //添加点：经度、纬度、高程、名称、像素大小、颜色、外边线颜色、边线宽度
          let drawEntity = entityController.appendPoint(lng, lat, height, '点', 10,
              new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 1),
              new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1),
              2);
          let drawEntities = window.CesiumZondy.DrawToolManager.findSource(vueKey,vueIndex).source;
          drawEntities.push(drawEntity);
          if(!vm.infinite){
            drawElement.stopDrawing();
          }
          vm.$emit('drawCreate', position, [lng, lat, height],webGlobeDraw);
          vm.$emit('drawcreate', position, [lng, lat, height],webGlobeDraw);
        }
      });
    },
    enableDrawLine () {
      this.drawOption = "enableDrawLine";
      let webGlobeDraw = this.getWebGlobe();
      let {Cesium,vueKey,vueIndex} = this;
      if(!Cesium){
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(webGlobeDraw);
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
          let drawEntity = webGlobeDraw.viewer.scene.primitives.add(polyline);
          let drawEntities = window.CesiumZondy.DrawToolManager.findSource(vueKey,vueIndex).source;
          drawEntities.push(drawEntity);
          if(!vm.infinite){
            drawElement.stopDrawing();
          }
          vm.$emit('drawCreate', positions,degreeArr,webGlobeDraw);
          vm.$emit('drawcreate', positions,degreeArr,webGlobeDraw);
        }
      });
    },
    enableDrawPolygon () {
      this.drawOption = "enableDrawPolygon";
      let webGlobeDraw = this.getWebGlobe();
      let {Cesium,vueKey,vueIndex} = this;
      if(!Cesium){
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(webGlobeDraw);
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
          let drawEntity = webGlobeDraw.viewer.scene.primitives.add(polygon);
          let drawEntities = window.CesiumZondy.DrawToolManager.findSource(vueKey,vueIndex).source;
          drawEntities.push(drawEntity);
          if(!vm.infinite){
            drawElement.stopDrawing();
          }
          vm.$emit('drawCreate', positions,degreeArr,webGlobeDraw);
          vm.$emit('drawcreate', positions,degreeArr,webGlobeDraw);
        }
      });
    },

    enableDrawRectangle(){
      this.drawOption = "enableDrawRectangle";
      let webGlobeDraw = this.getWebGlobe();
      let {Cesium,vueKey,vueIndex} = this;
      if(!Cesium){
        Cesium = window.Cesium;
      }
      let vm = this;
      let drawElement = this.getDrawElement(webGlobeDraw);
      drawElement.startDrawingExtent({
        callback: function (positions) {
          let drawEntity = webGlobeDraw.viewer.entities.add({
            id:"rectangle",
            rectangle: {
              coordinates: positions,
              material: Cesium.Color.RED.withAlpha(0.5)
            }
          });
          let drawEntities = window.CesiumZondy.DrawToolManager.findSource(vueKey,vueIndex).source;
          drawEntities.push(drawEntity);
          let radianPoints = [positions.west,positions.north,positions.east,positions.south];
          let Cartesian3Points = Cesium.Cartesian3.fromRadiansArray(radianPoints,webGlobeDraw.ellipsoid);
          let degreeArr = [];
          for (let i = 0;i < Cartesian3Points.length;i++){
            let cartographic = Cesium.Cartographic.fromCartesian(Cartesian3Points[i]);
            let lng = Cesium.Math.toDegrees(cartographic.longitude);
            let lat = Cesium.Math.toDegrees(cartographic.latitude);
            let height = positions.height;
            degreeArr.push([lng,lat,height]);
          }
          if(!vm.infinite){
            drawElement.stopDrawing();
          }
          vm.$emit('drawCreate', Cartesian3Points, degreeArr,webGlobeDraw);
          vm.$emit('drawcreate', Cartesian3Points, degreeArr,webGlobeDraw);
        }
      });
    }
  }
};
</script>
