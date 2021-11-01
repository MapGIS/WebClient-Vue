import {
  baiduMapLayer,
  DataSet,
  utilDataRangeIntensity as Intensity
} from "mapv";

var BaseLayer = baiduMapLayer ? baiduMapLayer.__proto__ : Function;

/**
 * @private
 * @class MapvBaseLayer
 * @classdesc MapV图层渲染
 * @param map - {string} 地图
 * @param layer -{Object} 图层
 * @param dataSet -{Object} 数据集
 * @param options -{Object} 交互时所需可选参数。
 * @see https://github.com/huiyan-fe/mapv/blob/master/API.md
 * @extends BaseLayer
 *
 */
export class MapvBaseLayer extends BaseLayer {
  constructor(map, dataSet, options, cesiumLayer) {
    super(map, dataSet, options);

    if (!BaseLayer) return;

    this.map = map; //此处的map是外面传入的cesium的map对象
    this.scene = map.scene;
    this.dataSet = dataSet;

    var self = this;
    var data = null;
    options = options || {};

    self.init(options);
    self.argCheck(options);

    this.initDevicePixelRatio();

    this.canvasLayer = cesiumLayer;

    this.stopAniamation = false;
    this.animation = options.animation;

    this.clickEvent = this.clickEvent.bind(this);
    this.mousemoveEvent = this.mousemoveEvent.bind(this);

    this.bindEvent();
  }

  /**
   * @function cesium.zondy.MapvBaseLayer.prototype.initDevicePixelRatio
   * @description window.devicePixelRatio是设备上物理像素和设备独立像素(device-independent pixels (dips))的比例。
   * 公式表示就是：window.devicePixelRatio = 物理像素 / dips,该函数主要应用与移动设备
   */
  initDevicePixelRatio() {
    this.devicePixelRatio = window.devicePixelRatio || 1;
  }

  /**
   * @function cesium.zondy.MapvBaseLayer.prototype.clickEvent
   * @description 百度mapv原本的事件只有clickEvent和mousemoveEvent
   * @param e 点击事件对象 {latlng, layerPoint, containerPoint, originalEvent}
   * @example
   * //mapv.map.BaseLayer.clickEvent
   * clickEvent(pixel, e) {
   *    var dataItem = this.isPointInPath(this.getContext(), pixel);
   *    if (dataItem) {
   *       this.options.methods.click(dataItem, e);
   *    } else {
   *       this.options.methods.click(null, e);
   *    }
   *  }
   */
  clickEvent(e) {
    var pixel = e.point;
    super.clickEvent(pixel, e);
  }

  /**
   * @function cesium.zondy.MapvBaseLayer.prototype.mousemoveEvent
   * @description 百度mapv原本的事件只有clickEvent和mousemoveEvent
   * @param e 点击事件对象 {latlng, layerPoint, containerPoint, originalEvent}
   * @example
   * //mapv.map.BaseLayer.mousemoveEvent
   * mousemoveEvent(pixel, e) {
   *   var dataItem = this.isPointInPath(this.getContext(), pixel);
   *   if (dataItem) {
   *       this.options.methods.mousemove(dataItem, e);
   *   } else {
   *       this.options.methods.mousemove(null, e);
   *   }
   * }
   */
  mousemoveEvent(e) {
    var pixel = e.point;
    super.mousemoveEvent(pixel, e);
  }

  addAnimatorEvent() {}

  animatorMovestartEvent() {
    var animationOptions = this.options.animation;
    if (this.isEnabledTime() && this.animator) {
      this.steps.step = animationOptions.stepsRange.start;
      //this.animator.stop();
    }
  }

  animatorMoveendEvent() {
    if (this.isEnabledTime() && this.animator) {
      //this.animator.start();
    }
  }

  bindEvent() {
    var map = this.map;
    if (this.options.methods) {
      if (this.options.methods.click) {
        //map.on('click', this.clickEvent);
      }
      if (this.options.methods.mousemove) {
        //map.on('mousemove', this.mousemoveEvent);
      }
    }
  }

  unbindEvent() {
    var map = this.map;

    if (this.options.methods) {
      if (this.options.methods.click) {
        map.off("click", this.clickEvent);
      }
      if (this.options.methods.mousemove) {
        map.off("mousemove", this.mousemoveEvent);
      }
    }
  }

  getContext() {
    return this.canvasLayer.canvas.getContext(this.context);
  }

  getZoom() {
    let zoom = 0;
    if (!this.map) return zoom;
    let tiles = this.map.scene.globe._surface._tilesToRender;
    if (tiles && tiles.length > 0) {
      zoom = this.map.scene.globe._surface._tilesToRender[0].level;
    }
    return zoom;
  }

  init(options) {
    var self = this;

    self.options = options;

    this.initDataRange(options);

    this.context = self.options.context || "2d";

    if (self.options.zIndex) {
      this.canvasLayer && this.canvasLayer.setZIndex(self.options.zIndex);
    }

    this.initAnimator();
  }

  // 经纬度左边转换为墨卡托坐标
  transferToMercator(dataSet) {
    if (!dataSet) {
      dataSet = this.dataSet;
    }
    var lnglat2Mkt = poi => {
      var mercator = {};
      var earthRad = 6378137.0;
      mercator.x = ((poi.lng * Math.PI) / 180) * earthRad;
      var a = (poi.lat * Math.PI) / 180;
      mercator.y =
        (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      return mercator;
    };

    var map = this.map;
    if (this.options.coordType !== "bd09mc") {
      var data = dataSet.get();
      data = dataSet.transferCoordinate(
        data,
        function(coordinates) {
          if (
            coordinates[0] < -180 ||
            coordinates[0] > 180 ||
            coordinates[1] < -90 ||
            coordinates[1] > 90
          ) {
            return coordinates;
          } else {
            var pixel = lnglat2Mkt({
              lng: coordinates[0],
              lat: coordinates[1]
            });
            return [pixel.x, pixel.y];
          }
        },
        "coordinates",
        "coordinates_mercator"
      );
      dataSet._set(data);
    }
  }

  _canvasUpdate(time) {
    var map = this.map;
    var scene = this.scene;
    if (!this.canvasLayer || this.stopAniamation) {
      return;
    }
    var self = this;

    var animationOptions = self.options.animation;

    var context = self.getContext();

    if (self.isEnabledTime()) {
      if (time === undefined) {
        this.clear(context);
        return;
      }
      if (this.context === "2d") {
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "rgba(0, 0, 0, .1)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
      }
    } else {
      this.clear(context);
    }

    if (this.context === "2d") {
      for (var key in self.options) {
        context[key] = self.options[key];
      }
    } else {
      context.clear(context.COLOR_BUFFER_BIT);
    }

    if (
      (self.options.minZoom && self.getZoom() < self.options.minZoom) ||
      (self.options.maxZoom && self.getZoom() > self.options.maxZoom)
    ) {
      return;
    }

    var dataGetOptions = {
      transferCoordinate: function(coordinate) {
        var pointSphere = Cesium.Cartesian3.fromDegrees(
          coordinate[0],
          coordinate[1]
        );
        var position = self.map.camera.position;
        var cameraHeight = self.map.scene.globe.ellipsoid.cartesianToCartographic(
          position
        ).height;
        cameraHeight += self.map.scene.globe.ellipsoid.maximumRadius * 1.2;
        var distance = Cesium.Cartesian3.distance(position, pointSphere);
        if (distance > cameraHeight) {
          return undefined;
          // return [-50, -50];a
        }

        let car3 = Cesium.Cartesian3.fromDegrees(
          coordinate[0],
          coordinate[1]
        );
        let point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          self.map.scene,
          car3
        );
        if (!point) return [0, 0];

        if (self.options.draw === "cluster") {
            return [point.x * self.devicePixelRatio, point.y * self.devicePixelRatio];            
        }
        return [point.x, point.y];
      }
    };

    if (time !== undefined) {
      dataGetOptions.filter = function(item) {
        var trails = animationOptions.trails || 10;
        if (time && item.time > time - trails && item.time < time) {
          return true;
        } else {
          return false;
        }
      };
    }

    var data;
    var zoom = this.getZoom();
    if (
      this.options.draw === "cluster" &&
      (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)
    ) {
      let rect = this.map.scene.camera.computeViewRectangle();
      const south = Cesium.Math.toDegrees(rect.south);
      const north = Cesium.Math.toDegrees(rect.north);
      const east  = Cesium.Math.toDegrees(rect.east);
      const west = Cesium.Math.toDegrees(rect.west);

      var clusterData = this.supercluster.getClusters(
        [west, south, east, north],
        zoom
      );
      this.pointCountMax = this.supercluster.trees[zoom].max;
      this.pointCountMin = this.supercluster.trees[zoom].min;
      var intensity = {};
      var color = null;
      var size = null;
      if (this.pointCountMax === this.pointCountMin) {
        color = this.options.fillStyle;
        size = this.options.minSize || 8;
      } else {
        intensity = new Intensity({
          min: this.pointCountMin,
          max: this.pointCountMax,
          minSize: this.options.minSize || 8,
          maxSize: this.options.maxSize || 30,
          gradient: this.options.gradient
        });
      }
      for (var i = 0; i < clusterData.length; i++) {
        var item = clusterData[i];
        if (item.properties && item.properties.cluster_id) {
          clusterData[i].size =
            size || intensity.getSize(item.properties.point_count);
          clusterData[i].fillStyle =
            color || intensity.getColor(item.properties.point_count);
        } else {
          clusterData[i].size = self.options.size;
        }
      }
      this.clusterDataSet.set(clusterData);
      this.transferToMercator(self.clusterDataSet);
      data = self.clusterDataSet.get(dataGetOptions);
    } else {
      data = self.dataSet.get(dataGetOptions);
    }

    this.processData(data);

    if (self.options.unit == "m" && self.options.size) {
      //self.options._size = self.options.size / zoomUnit;
      self.options._size = self.options.size;
    } else {
      self.options._size = self.options.size;
    }

    var pixel = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      Cesium.Cartesian3.fromDegrees(0, 0)
    );
    if (!pixel) pixel = [0, 0];
    this.drawContext(context, new DataSet(data), self.options, pixel);

    self.options.updateCallback && self.options.updateCallback(time);
  }

  updateData(data, options) {
    var _data = data;
    if (_data && _data.get) {
      _data = _data.get();
    }
    if (_data != undefined) {
      this.dataSet.set(_data);
    }

    super.update({
      options: options
    });
  }

  addData(data, options) {
    var _data = data;
    if (data && data.get) {
      _data = data.get();
    }
    this.dataSet.add(_data);
    this.update({
      options: options
    });
  }

  getData() {
    return this.dataSet;
  }

  removeData(filter) {
    if (!this.dataSet) {
      return;
    }
    var newData = this.dataSet.get({
      filter: function(data) {
        return filter != null && typeof filter === "function"
          ? !filter(data)
          : true;
      }
    });
    this.dataSet.set(newData);
    this.stopAniamation = true;
    /* this.update({
          options: null
      }); */
  }

  clearData() {
    this.dataSet && this.dataSet.clear();
    this.stopAniamation = true;
    /* this.update({
          options: null
      }); */
  }

  draw() {
    this.canvasLayer.draw();
  }

  //该函数从mapv/canvas/clear中提取
  clear(context) {
    context &&
      context.clearRect &&
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
}
