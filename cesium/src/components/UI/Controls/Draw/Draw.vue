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
  name: "cesium-base-draw",
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
    this.mount();
  },
  destroyed () {
    this.unmount();
  },
  watch: {},
  methods: {
    createCesiumObject () {
      const { Cesium, webGlobe } = this;
      const { viewer } = webGlobe;
      return new Cesium.DrawPolygonTool(viewer, this.getDrawResult.bind(this))
    },

    mount () {
      const { webGlobe, vueIndex, vueKey } = this;
      const { viewer } = webGlobe;
      //构造几何绘制控制对象
      let entityController = new CesiumZondy.Manager.EntityController({
        viewer: viewer
      });

      //构造鼠标事件管理对象
      let mouseEventManager = new CesiumZondy.Manager.MouseEventManager({
        viewer: viewer
      });

      let tool = this.createCesiumObject();

      CesiumZondy.DrawToolManager.addSource(vueKey, vueIndex, tool, {
        entityController, mouseEventManager
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
      let { webGlobe, vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController, mouseEventManager } = find.options;
      mouseEventManager.unRegisterMouseEvent('LEFT_CLICK');
      mouseEventManager.unRegisterMouseEvent('MOUSE_MOVE');
      mouseEventManager.unRegisterMouseEvent('RIGHT_CLICK');
      //移除所有实体
      entityController.removeAllEntities();
    },

    enableDrawPoint () {
      const vm = this;
      this.removeEntities();
      let { webGlobe, vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController, mouseEventManager } = find.options;
      //注册鼠标左键单击事件
      mouseEventManager.registerMouseEvent('LEFT_CLICK', function (movement) {
        //屏幕坐标转笛卡尔坐标
        let cartesian = webGlobe.viewer.getCartesian3Position(movement.position, cartesian);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height; //模型高度
        //添加点：经度、纬度、高程、名称、像素大小、颜色、外边线颜色、边线宽度
        entityController.appendPoint(lng, lat, height, '点', 10,
          new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 1),
          new Cesium.Color(255 / 255, 255 / 255, 0 / 255, 1),
          2);
        vm.$emit('drawCreate', cartesian, [lng, lat, height]);
        vm.$emit('drawcreate', cartesian, [lng, lat, height]);
      });
      //注册鼠标右键单击事件
      mouseEventManager.registerMouseEvent('RIGHT_CLICK', function (e) {
        mouseEventManager.unRegisterMouseEvent('LEFT_CLICK');
        mouseEventManager.unRegisterMouseEvent('RIGHT_CLICK');
      });
    },

    enableDrawLine () {
      const vm = this;
      this.removeEntities();
      let { webGlobe, vueKey, vueIndex, Cesium, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController, mouseEventManager } = find.options;
      let pointArray = new Array();
      let allPoint = new Array();
      //注册鼠标左键单击事件
      mouseEventManager.registerMouseEvent('LEFT_CLICK', function (e) {
        //屏幕坐标转笛卡尔坐标
        let cartesian = webGlobe.viewer.getCartesian3Position(e.position, cartesian);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);

        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        pointArray.push(lng);
        allPoint.push(lng);

        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        pointArray.push(lat);
        allPoint.push(lat);

        //模型高度
        let height = cartographic.height;
        pointArray.push(height);
        allPoint.push(height);

        //添加点
        if (pointArray.length > 3) {
          //绘制线（名称、点数组、线宽、线颜色、是否识别带高度的坐标、是否贴地形、附加属性）
          entityController.appendLine('不贴地线', pointArray, 2, new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 0.8), true, false, {});
          pointArray = new Array();
          pointArray.push(lng);
          pointArray.push(lat);
          pointArray.push(height);
          webGlobe.viewer.entities.removeById('moveline');
        }
      });
      //注册鼠标移动事件
      mouseEventManager.registerMouseEvent('MOUSE_MOVE', function (e) {
        webGlobe.viewer.entities.removeById('moveline');
        if (pointArray.length < 3) {
          return;
        }
        let cartesian = webGlobe.viewer.getCartesian3Position(e.endPosition, cartesian);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;
        let firstPosition = Cesium.Cartesian3.fromDegrees(pointArray[0], pointArray[1], pointArray[2]);
        let movePosition = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        console.log("f" + firstPosition);
        console.log("m" + movePosition);
        let redBox = webGlobe.viewer.entities.add({
          id: 'moveline',
          polyline: {
            positions: [firstPosition, movePosition],
            width: 2,
            material: Cesium.Color.YELLOW
          }
        });
      });
      //注册鼠标右键单击事件
      mouseEventManager.registerMouseEvent('RIGHT_CLICK', function (e) {
        //移除所有实体
        entityController.removeAllEntities();
        if (allPoint.length > 3) {
          //绘制线（名称、点数组、线宽、线颜色、是否识别带高度的坐标、是否贴地形、附加属性）
          entityController.appendLine('不贴地线', allPoint, 2, new Cesium.Color(255 / 255, 0 / 255, 0 / 255, 0.8), true, false, {});
          vm.$emit('drawCreate', allPoint);
          vm.$emit('drawcreate', allPoint);
        }
        pointArray = new Array();
        allPoint = new Array();
        //注销鼠标各项事件
        mouseEventManager.unRegisterMouseEvent('LEFT_CLICK');
        mouseEventManager.unRegisterMouseEvent('MOUSE_MOVE');
        mouseEventManager.unRegisterMouseEvent('RIGHT_CLICK');
      });
    },

    enableDrawPolygon () {
      let { vueKey, vueIndex, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let tool = find.source;
      //清除绘制的内容
      this.removeEntities();
      //激活工具
      tool && tool.activeTool();
    },

    /*绘制结果回调函数*/
    getDrawResult (entity) {
      let { webGlobe, vueKey, vueIndex, Cesium, CesiumZondy } = this;
      let find = CesiumZondy.DrawToolManager.findSource(vueKey, vueIndex);
      let { entityController } = find.options;
      if (entity) {
        let pointArr = new Array();
        //坐标转换、处理
        for (let i = 0; i < entity._points.length; i++) {
          let point = entity._points[i];
          let ellipsoid = webGlobe.viewer.scene.globe.ellipsoid;
          let cartesian3 = new Cesium.Cartesian3(point.x, point.y, point.z);
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lng = Cesium.Math.toDegrees(cartographic.longitude);
          let alt = cartographic.height;
          pointArr.push(lng, lat, alt);
        }

        //移除所有实体
        entityController.removeAllEntities();

        let positions = Cesium.Cartesian3.fromDegreesArrayHeights(pointArr);
        this.$emit('drawCreate', positions, pointArr);
        this.$emit('drawcreate', positions, pointArr);
        //构造区对象
        let polygon = {
          name: "立体区",
          polygon: {
            //坐标点
            hierarchy: positions,
            //是否指定各点高度
            perPositionHeight: true,
            //颜色
            material: new Cesium.Color(33 / 255, 150 / 255, 243 / 255, 0.5),
            //轮廓线是否显示
            outline: true,
            //轮廓线颜色
            outlineColor: Cesium.Color.BLACK,
          }
        };
        //绘制图形通用方法：对接Cesium原生特性
        entityController.appendGraphics(polygon);
        //清除
        pointArr = new Array();
      }
    },

  }
};
</script>
