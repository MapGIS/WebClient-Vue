import { MapvBaseLayer } from "./MapvBaseLayer";

var idIndex = 0;

/**
 * @author 基础平台/创新中心 潘卓然 ParnDeedlit
 * @class CesiumZondy.zondy.MapVLayer
 * @classdesc 基于新建立的Html Element嵌入mapv
 * @param map - {Object} 传入的cesium的地图对象Viewer
 * @param dataset - {MapvDataSet} 传入的mapv的属性。 <br>
 * @param mapVOptions - {MapvOption} 可选参数。<br>
 * @param container - {Element} 外部传入的div;外接的方式使用mapv<br>
 * var options = {
      size: 13,
      gradient: {
        0.25: "rgb(0,0,255)",
        0.55: "rgb(0,255,0)",
        0.85: "yellow",
        1.0: "rgb(255,0,0)"
      },
      max: 60,
      animation: {
        type: 'time',
        stepsRange: {
          start: 0,
          end: 100
        },
        trails: 10,
        duration: 4,
      },
      draw: 'heatmap'
    }

    var mapvLayer = new CesiumZondy.Overlay.MapvLayer(map, dataSet, options);
 */
export class MapvLayer {
  constructor(map, dataSet, mapVOptions, container) {
    this.map = map;
    this.scene = map.scene;

    this.mapvBaseLayer = new MapvBaseLayer(map, dataSet, mapVOptions, this);
    this.mapVOptions = mapVOptions;

    this.initDevicePixelRatio();

    this.canvas = this._creteWidgetCanvas(); //this._createCanvas();

    this.render = this.render.bind(this);
    this.postRenderTime = 0;

    let cesiumOpt = mapVOptions.cesium;
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

    this.bindEvent();

    this._reset();
  }

  initDevicePixelRatio() {
    this.devicePixelRatio = window.devicePixelRatio || 1;
  }

  addInnerContainer() {
    //var container = document.createElement('div');
    this.container.appendChild(this.canvas);
    //container.appendChild(this.canvas);
    //return container;
  }

  bindEvent() {
    let self = this;
    var map = this.map;
    //下面几个是cesium专属事件,clickEvent和mousemoveEvent是mapv内部自带的方法不放出来
    this.innerMoveStart = this.moveStartEvent.bind(this);
    this.innerMoveEnd = this.moveEndEvent.bind(this);

    this.innnerZoomStart = this.zoomStartEvent.bind(this);
    this.innnerZoomEnd = this.zoomEndEvent.bind(this);

    this.postStartEvent = this.postStartEvent.bind(this);
    this.postEndEvent = this.postEndEvent.bind(this);

    var handler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    //handler.setInputAction(this.innerMoveEnd, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    if (this.postRender) {
      // this.scene.postRender.addEventListener(this.postEventHandle);
      this.scene.camera.moveStart.addEventListener(this.postStartEvent, this);
      this.scene.camera.moveEnd.addEventListener(this.postEndEvent, this);
    } else {
      handler.setInputAction(this.innerMoveEnd, Cesium.ScreenSpaceEventType.WHEEL);
      handler.setInputAction(this.innerMoveStart, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      handler.setInputAction(this.innerMoveEnd, Cesium.ScreenSpaceEventType.LEFT_UP);
      handler.setInputAction(this.innerMoveStart, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
      handler.setInputAction(this.innerMoveEnd, Cesium.ScreenSpaceEventType.RIGHT_UP);

      map.scene.camera.moveEnd.addEventListener(function () {
        //获取当前相机高度
        self.innerMoveEnd();
      });
    }
  }

  unbindEvent() {
    var map = this.map;
    if (this.postRender) {
      this.scene.camera.moveStart.removeEventListener(this.postStartEvent, this);
      this.scene.camera.moveEnd.removeEventListener(this.postEndEvent, this);
    }
  }

  moveStartEvent() {
    if (this.mapvBaseLayer) {
      this.mapvBaseLayer.animatorMovestartEvent();
    }
      this._unvisiable();
  }

  moveEndEvent() {
    if (this.mapvBaseLayer) {
      this.mapvBaseLayer.animatorMoveendEvent();
    }
    this._reset();
    this._visiable();
  }

  zoomStartEvent() {
    this._unvisiable();
  }
  zoomEndEvent() {
    this._unvisiable();
  }
  postStartEvent() {
    if (this.mapvBaseLayer) {
      this.mapvBaseLayer.animatorMovestartEvent();
      this.scene.postRender.addEventListener(this._reset, this);
    }
    this._visiable();
  }

  postEndEvent() {
    if (this.mapvBaseLayer) {
      this.mapvBaseLayer.animatorMoveendEvent();
      this.scene.postRender.removeEventListener(this._reset, this);
    }
    this._reset();
    this._visiable();
  }

  //-----------------------------------Start Data Operation---------------------------------

  /**
   * 增加数据
   * @function CesiumZondy.zondy.MapVLayer.prototype.addData
   *
   * @param data - {Array} 数据.
   * @param options - {Object} 只做额外增加的字段作用
   */
  addData(data, options) {
    if (this.mapvBaseLayer == undefined) return;
    this.mapvBaseLayer.addData(data, options);
  }

  /**
   * 更新数据
   * @function CesiumZondy.zondy.MapVLayer.prototype.updateData
   *
   * @param data - {Array} 数据.
   * @param options - {Object} 只做额外增加的字段作用
   */
  updateData(data, options) {
    if (this.mapvBaseLayer == undefined) return;
    this.mapvBaseLayer.updateData(data, options);
  }

  /**
   * 获取数据
   * @function CesiumZondy.zondy.MapVLayer.prototype.getData
   *
   * @param data - {Array} 数据.
   * @param options - {Object} 只做额外增加的字段作用
   */
  getData() {
    if (this.mapvBaseLayer) {
      this.dataSet = this.mapvBaseLayer.getData();
    }
    return this.dataSet;
  }

  removeData(filter) {
    if (this.mapvBaseLayer == undefined) return;
    this.mapvBaseLayer && this.mapvBaseLayer.removeData(filter);
  }

  /**
   * 删除数据
   * @function CesiumZondy.zondy.MapVLayer.prototype.removeAllData
   */
  removeAllData() {
    if (this.mapvBaseLayer == undefined) return;
    this.mapvBaseLayer.clearData();
  }
  //-----------------------------------End Data Operation---------------------------------
  _visiable() {
    this.canvas.style.display = "block";
    return this;
  }

  _unvisiable() {
    this.canvas.style.display = "none";
    return this;
  }

  _createCanvas() {
    var canvas = document.createElement("canvas");
    canvas.id = this.mapVOptions.layerid || "mapv" + idIndex++;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";

    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = this.mapVOptions.zIndex || 100;

    canvas.width = parseInt(this.map.canvas.width);
    canvas.height = parseInt(this.map.canvas.height);
    canvas.style.width = this.map.canvas.style.width;
    canvas.style.height = this.map.canvas.style.height;
    var devicePixelRatio = this.devicePixelRatio;
    if (this.mapVOptions.context == "2d") {
      canvas
        .getContext(this.mapVOptions.context)
        .scale(devicePixelRatio, devicePixelRatio);
    }
    return canvas;
  }

  _creteWidgetCanvas() {
    // console.log("devicePixelRatio", this.devicePixelRatio);
    var canvas = document.createElement("canvas");

    canvas.id = this.mapVOptions.layerid || "mapv" + idIndex++;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";

    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = this.mapVOptions.zIndex || 100;

    canvas.width = parseInt(this.map.canvas.width);
    canvas.height = parseInt(this.map.canvas.height);
    //canvas.style.width =  this.map.canvas.style.width;
    //canvas.style.height =  this.map.canvas.style.height;
    var devicePixelRatio = this.devicePixelRatio;
    if (this.mapVOptions.context == "2d") {
      canvas.getContext("2d").scale(devicePixelRatio, devicePixelRatio);
    }
    return canvas;
  }

  _reset() {
    this.resizeCanvas();
    this.fixPosition();
    this.onResize();
    this.render();
  }

  /**
   * 强制重回图层
   * @function CesiumZondy.zondy.MapVLayer.prototype.draw
   */
  draw() {
    this._reset();
  }

  /**
   * 显示图层
   * @function CesiumZondy.zondy.MapVLayer.prototype.show
   */
  show() {
    this._visiable();
  }
  /**
   * 隐藏图层
   * @function CesiumZondy.zondy.MapVLayer.prototype.hide
   */
  hide() {
    this._unvisiable();
  }

  /**
   * 销毁图层-实际调用remove，为了接口保持一致
   * @function CesiumZondy.zondy.MapVLayer.prototype.destroy
   */
  destroy() {
    this.remove();
  }

  /**
   * 销毁图层
   * @function CesiumZondy.zondy.MapVLayer.prototype.remove
   */
  remove() {
    if (this.mapvBaseLayer == undefined) return;
    this.removeAllData();
    this.mapvBaseLayer.clear(this.mapvBaseLayer.getContext());
    this.mapvBaseLayer = undefined;
    var parent = this.canvas.parentElement;
    parent.removeChild(this.canvas);
  }

  /**
   * 更新图层
   * @function CesiumZondy.zondy.MapVLayer.prototype.update
   */
  update(opt) {
    if (opt == undefined) {
      return;
    }
    this.updateData(opt.data, opt.options);
  }

  resizeCanvas() {
    //this.mapContainer.style.perspective = this.map.transform.cameraToCenterDistance + 'px';
    if (this.canvas == undefined || this.canvas == null) return;
    var canvas = this.canvas;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.width = parseInt(this.map.canvas.width);
    canvas.height = parseInt(this.map.canvas.height);
    //canvas.style.width = this.map.canvas.style.width;
    //canvas.style.height = this.map.canvas.style.height;
    var devicePixelRatio = this.devicePixelRatio;
    if (this.mapVOptions.context == "2d") {
      canvas.getContext("2d").scale(devicePixelRatio, devicePixelRatio);
    }
  }

  fixPosition() {}

  onResize() {}

  render() {
    if (this.mapvBaseLayer == undefined) return;
    this.mapvBaseLayer._canvasUpdate();
  }
}
