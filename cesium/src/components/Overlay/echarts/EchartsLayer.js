import * as echarts from "echarts";
import "echarts-gl";

import { MapCoordSys } from "./MapCoordSys";
import debounce from "lodash/debounce";

window.EchartsIdIndex = 0;

/**
 * @author 基础平台/创新中心 潘卓然 ParnDeedlit
 * @class vueCesium.zondy.EchartsLayer
 * @description cesium的echars 4.0的实现。后面接手的人，没看懂echarts源码之前请不要改动下面的代码
 * @param map - {Object} 传入的leaflet的地图对象
 * @param options - {Object} echarts.options
 * @param options.cesium - options.cesium.
 * @param {Boolean} [options.cesium.postRender=false] 是否实时渲染
 * @param {Boolean} [options.cesium.postRenderFrame=30] 每间隔多少帧渲染一次
 * @param container - {Element} 外部传入的div;外接的方式使用mapv<br>
 *
 * @see http://echarts.baidu.com/api.html#echarts
 * @example 这里唯一要注意的是我们中地数码的ceisum的右键事件不是放大缩小而是旋转视角
 */
export class EchartsLayer {
  constructor(map, options, container) {
    this.map = map;
    this.scene = map.scene;
    this.options = options;
    this.initStats = false;

    this.layerId = options.layerId || "echarts" + ++window.EchartsIdIndex;
    this.layerClass = options.layerClass || "echartlayerdefaultclass";

    this.initDevicePixelRatio();

    this.canvas = this._createCanvas();

    /*         this.container = map.container;
        this.addInnerContainer(); */

    this.postRenderTime = 0;

    let cesiumOpt = options.cesium;
    if (cesiumOpt) {
      this.postRender = cesiumOpt.postRender || false;
      this.postRenderFrame = cesiumOpt.postRenderFrame || 30;
    }

    if (container != undefined) {
      this.container = container;
      container.appendChild(this.canvas);
    } else {
      var parents = document.getElementsByClassName("cesium-widget");
      var parent = parents.length > 0 ? parents[0] : map.container;
      this.container = parent;
      this.addInnerContainer();
    }

    this.chart = echarts.init(this.canvas);

    this.initEcharts();
    this._resizeCanvas();

    this.resize();
    return this;
  }

  initDevicePixelRatio() {
    this.devicePixelRatio = window.devicePixelRatio || 1;
  }

  addInnerContainer() {
    this.container.appendChild(this.canvas);
  }

  initEcharts() {
    // echarts.cesiumMap = this.map; echart 5.0版本结构调整后不再允许动态增加字段了，因此用全局的window来替代
    window.EchartCesiumMap = window.EchartCesiumMap || {};
    window.EchartCesiumMap[window.EchartsIdIndex] = this.map;

    echarts.extendComponentModel({
      type: "cesium",
      getBMap: function () {
        return this.__cesium;
      },
      defaultOption: {
        roam: false,
      },
    });

    echarts.registerCoordinateSystem("cesium", MapCoordSys);

    echarts.registerAction(
      {
        type: "CesiumRoma",
        event: "CesiumRoma",
        update: "updateLayout",
      },
      function (payload, ecModel) {
        ecModel.eachComponent(
          {
            mainType: "cesium",
            query: payload,
          },
          function (componentModel) {}
        );
      }
    );

    return this;
  }

  _createCanvas() {
    var canvas = document.createElement("div");
    /*         canvas.setAttribute('id', this.layerId);
                canvas.setAttribute('class', this.layerClass); */
    //canvas.id = this.layerId;
    canvas.className = "cesium-echarts-layer";
    canvas.setAttribute("class", "cesium-echarts-layer");

    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";

    canvas.style.pointerEvents = "none"; //屏蔽鼠标事件
    canvas.style.zIndex = this.options.zIndex || 100;

    var width = parseInt(this.map.canvas.width) + "px";
    var height = parseInt(this.map.canvas.height) + "px";

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width;
    canvas.style.height = height;

    //这段可以先不不放开
    /*  var devicePixelRatio = this.devicePixelRatio;
        if (this.mapVOptions.context == '2d') {
            canvas.getContext(this.mapVOptions.context).scale(devicePixelRatio, devicePixelRatio);
        } */
    return canvas;
  }

  _resizeCanvas() {
    const self = this;

    window.onresize = function () {
      var canvas = self.canvas;
      var map = self.map;

      canvas.style.position = "absolute";
      canvas.style.top = "0px";
      canvas.style.left = "0px";

      var width = parseInt(map.canvas.width) + "px";
      var height = parseInt(map.canvas.height) + "px";

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width;
      canvas.style.height = height;

      self.chart.resize();
    };

    //this.mapContainer.style.perspective = this.map.transform.cameraToCenterDistance + 'px';
  }

  _visible() {
    this.canvas.style.visibility = "visible";
  }

  _unvisible() {
    this.canvas.style.visibility = "hidden";
  }

  addTo(map) {
    var self = this;
    echarts.extendComponentView({
      type: "cesium",

      render: function (mapModel, ecModel, api) {
        var rendering = true;

        var cesiumMap = window.EchartCesiumMap[window.EchartsIdIndex]; // echarts.cesiumMap;
        var viewportRoot = api.getZr().painter.getViewportRoot();
        var coordSys = mapModel.coordinateSystem;
        function moveHandler() {
          if (rendering) {
            return;
          }
          self._unvisible();
          if (!self.map) {
            self.map = map;
          }
          var offsetEl = self.map.canvas;

          var mapOffset = [
            -parseInt(offsetEl.style.left, 10) || 0,
            -parseInt(offsetEl.style.top, 10) || 0,
          ];
          viewportRoot.style.left = mapOffset[0] + "px";
          viewportRoot.style.top = mapOffset[1] + "px";

          coordSys.setMapOffset(mapOffset);

          mapModel.__mapOffset = mapOffset;
          //mapModel.__mapViewRect = cesiumMap.scene.camera.computeViewRectangle();

          api.dispatchAction({
            type: "CesiumRoma",
          });
          self._visible();
        }

        function moveEndHandler(type, target) {
          if (rendering) {
            return;
          }
          if (!self.map) {
            self.map = map;
          }
          var offsetEl = self.map.canvas;

          var mapOffset = [
            -parseInt(offsetEl.style.left, 10) || 0,
            -parseInt(offsetEl.style.top, 10) || 0,
          ];
          viewportRoot.style.left = mapOffset[0] + "px";
          viewportRoot.style.top = mapOffset[1] + "px";

          coordSys.setMapOffset(mapOffset);
          mapModel.__mapOffset = mapOffset;

          api.dispatchAction({
            type: "CesiumRoma",
            pitch: 0, // self.map.camera.pitch,
            bearing: 0, // self.map,
          });
          self._visible();
        }

        function zoomStartHandler() {
          self._unvisible();
          if (rendering) {
            return;
          }
          api.dispatchAction({
            type: "CesiumRoma",
          });
          self._visible();
        }

        function zoomEndHandler() {
          if (rendering) {
            return;
          }
          api.dispatchAction({
            type: "CesiumRoma",
          });
          self._visible();
        }

        function postHandler(type, target) {
          self.postRenderTime >= 1000
            ? (self.postRenderTime = 0)
            : self.postRenderTime++;
          if (self.postRenderTime % self.postRenderFrame !== 0) {
            return;
          }
          if (rendering) {
            return;
          }
          if (!self.map) {
            self.map = map;
          }
          var offsetEl = self.map.canvas;

          var mapOffset = [
            -parseInt(offsetEl.style.left, 10) || 0,
            -parseInt(offsetEl.style.top, 10) || 0,
          ];
          viewportRoot.style.left = mapOffset[0] + "px";
          viewportRoot.style.top = mapOffset[1] + "px";

          coordSys.setMapOffset(mapOffset);
          mapModel.__mapOffset = mapOffset;

          api.dispatchAction({
            type: "CesiumRoma",
            pitch: 0, // self.map.camera.pitch,
            bearing: 0, // self.map,
          });
          self._visible();
        }

        if (self.postRender) {
          var handler = new Cesium.ScreenSpaceEventHandler(self.scene.canvas);
          handler.setInputAction(
            () => self.scene.postRender.addEventListener(postHandler),
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
          );
          handler.setInputAction(
            () => self.scene.postRender.addEventListener(postHandler),
            Cesium.ScreenSpaceEventType.WHEEL
          );
          handler.setInputAction(
            () => self.scene.postRender.addEventListener(postHandler),
            Cesium.ScreenSpaceEventType.LEFT_DOWN
          );
          handler.setInputAction(
            () => self.scene.postRender.addEventListener(postHandler),
            Cesium.ScreenSpaceEventType.RIGHT_DOWN
          );
          handler.setInputAction(
            () => self.scene.postRender.removeEventListener(postHandler),
            Cesium.ScreenSpaceEventType.LEFT_UP
          );
          handler.setInputAction(
            () => self.scene.postRender.removeEventListener(postHandler),
            Cesium.ScreenSpaceEventType.RIGHT_UP
          );
        } else {
          var handler = new Cesium.ScreenSpaceEventHandler(self.scene.canvas);

          if (self.initStats == false) {
            self.initStats = true;
            handler.setInputAction(
              zoomStartHandler,
              Cesium.ScreenSpaceEventType.MOUSE_MOVE
            );
            handler.setInputAction(
              zoomStartHandler,
              Cesium.ScreenSpaceEventType.WHEEL
            );
            handler.setInputAction(
              moveHandler,
              Cesium.ScreenSpaceEventType.LEFT_DOWN
            );
            handler.setInputAction(
              moveEndHandler,
              Cesium.ScreenSpaceEventType.LEFT_UP
            );
            handler.setInputAction(
              moveHandler,
              Cesium.ScreenSpaceEventType.RIGHT_DOWN
            );
            handler.setInputAction(
              moveEndHandler,
              Cesium.ScreenSpaceEventType.RIGHT_UP
            );
            self.map.scene.camera.moveEnd.addEventListener(function () {
              //获取当前相机高度
              moveEndHandler();
            });
            //cesiumMap.scene.camera.moveStart.addEventListener(zoomStartHandler);
            //cesiumMap.scene.camera.moveEnd.addEventListener(moveEndHandler);
          }
        }

        var roam = mapModel.get("roam");
        if (roam && roam !== "scale") {
          // todo 允许拖拽
        } else {
          // todo 不允许拖拽
        }
        if (roam && roam !== "move") {
          // todo 允许移动
        } else {
          // todo 不允许允许移动
        }

        rendering = false;
      },
    });

    this.chart.setOption(this.options);
    return this;
  }

  /**
   * 显示图层
   * @function vueCesium.zondy.EchartsLayer.prototype.show
   */
  show() {
    this._visible();
  }

  /**
   * 隐藏图层
   * @function vueCesium.zondy.EchartsLayer.prototype.hide
   */
  hide() {
    this._unvisible();
  }

  /**
   * 更新图层
   * @param options - {Object} echarts.options
   * @function vueCesium.zondy.EchartsLayer.prototype.hide*
   */
  update(options) {
    this.chart.setOption(options);
  }

  /**
   * 重置图层大小
   * @function vueCesium.zondy.EchartsLayer.prototype.resize
   */
  resize() {
    if (this.canvas == undefined || this.canvas == null) return;
    var canvas = this.canvas;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.width = parseInt(this.map.canvas.width);
    canvas.height = parseInt(this.map.canvas.height);
    canvas.style.width = this.map.canvas.style.width;
    canvas.style.height = this.map.canvas.style.height;
  }

  /**
   * 删除图层
   * @function vueCesium.zondy.EchartsLayer.prototype.remove
   */
  remove() {
    var self = this;
    /*         this.map._listeners.move.forEach(function (element) {
                    if (element.name === 'moveHandler') {
                        self.map.off('move', element);
                    }
                });
                this.map._listeners.move.forEach(function (element) {
                    if (element.name === 'zoomEndHandler') {
                        self.map.off('zoomend', element);
                    }
                }); */

    this.chart.clear();

    if (this.canvas.parentElement)
      this.canvas.parentElement.removeChild(this.canvas);
    this.map = undefined;
    return this;
  }

  _reset() {
    this._resizeCanvas();

    // this.resize();
  }
}
