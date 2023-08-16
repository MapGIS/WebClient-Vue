import {
  baiduMapLayer,
  DataSet,
  utilDataRangeIntensity as Intensity,
} from "mapv";

import Supercluster from "./SuperCluster";

let BaseLayer = baiduMapLayer ? baiduMapLayer.__proto__ : Function;

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

    let self = this;
    let data = null;
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
    this.devicePixelRatio = 1;
  }

  /**
   * @function cesium.zondy.MapvBaseLayer.prototype.clickEvent
   * @description 百度mapv原本的事件只有clickEvent和mousemoveEvent
   * @param e 点击事件对象 {latlng, layerPoint, containerPoint, originalEvent}
   * @example
   * //mapv.map.BaseLayer.clickEvent
   * clickEvent(pixel, e) {
   *    let dataItem = this.isPointInPath(this.getContext(), pixel);
   *    if (dataItem) {
   *       this.options.methods.click(dataItem, e);
   *    } else {
   *       this.options.methods.click(null, e);
   *    }
   *  }
   */
  clickEvent(e) {
    let pixel = e.point;
    super.clickEvent(pixel, e);
  }

  /**
   * @function cesium.zondy.MapvBaseLayer.prototype.mousemoveEvent
   * @description 百度mapv原本的事件只有clickEvent和mousemoveEvent
   * @param e 点击事件对象 {latlng, layerPoint, containerPoint, originalEvent}
   * @example
   * //mapv.map.BaseLayer.mousemoveEvent
   * mousemoveEvent(pixel, e) {
   *   let dataItem = this.isPointInPath(this.getContext(), pixel);
   *   if (dataItem) {
   *       this.options.methods.mousemove(dataItem, e);
   *   } else {
   *       this.options.methods.mousemove(null, e);
   *   }
   * }
   */
  mousemoveEvent(e) {
    let pixel = e.point;
    super.mousemoveEvent(pixel, e);
  }

  addAnimatorEvent() {}

  animatorMovestartEvent() {
    let animationOptions = this.options.animation;
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
    let map = this.map;
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
    let map = this.map;

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
    let self = this;

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
    let lnglat2Mkt = (poi) => {
      let mercator = {};
      let earthRad = 6378137.0;
      mercator.x = ((poi.lng * Math.PI) / 180) * earthRad;
      let a = (poi.lat * Math.PI) / 180;
      mercator.y =
        (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      return mercator;
    };

    let map = this.map;
    if (this.options.coordType !== "bd09mc") {
      let data = dataSet.get();
      data = dataSet.transferCoordinate(
        data,
        function (coordinates) {
          if (
            coordinates[0] < -180 ||
            coordinates[0] > 180 ||
            coordinates[1] < -90 ||
            coordinates[1] > 90
          ) {
            return coordinates;
          } else {
            let pixel = lnglat2Mkt({
              lng: coordinates[0],
              lat: coordinates[1],
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

  dataOptions() {
    const self = this;
    return {
      transferCoordinate: function (coordinate) {
        let pointSphere = Cesium.Cartesian3.fromDegrees(
          coordinate[0],
          coordinate[1]
        );
        let position = self.map.camera.position;
        let cameraHeight =
          self.map.scene.globe.ellipsoid.cartesianToCartographic(
            position
          ).height;
        cameraHeight += self.map.scene.globe.ellipsoid.maximumRadius * 1.2;
        let distance = Cesium.Cartesian3.distance(position, pointSphere);
        if (distance > cameraHeight) {
          return undefined;
          // return [-50, -50];a
        }

        let car3 = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
        let point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          self.map.scene,
          car3
        );
        if (!point) return [0, 0];

        if (self.options.draw === "cluster") {
          return [
            point.x * self.devicePixelRatio,
            point.y * self.devicePixelRatio,
          ];
        }
        return [point.x, point.y];
      },
    };
  }

  changeCluster() {
    const self = this;
    let zoom = this.getZoom();
    let dataGetOptions = this.dataOptions();
    let rect = this.map.scene.camera.computeViewRectangle();
    const south = Cesium.Math.toDegrees(rect.south);
    const north = Cesium.Math.toDegrees(rect.north);
    const east = Cesium.Math.toDegrees(rect.east);
    const west = Cesium.Math.toDegrees(rect.west);

    let clusterData = this.supercluster.getClusters(
      [west, south, east, north],
      zoom
    );
    this.pointCountMax = this.supercluster.trees[zoom].max;
    this.pointCountMin = this.supercluster.trees[zoom].min;
    let intensity = {};
    let color = null;
    let size = null;
    if (this.pointCountMax === this.pointCountMin) {
      color = this.options.fillStyle;
      size = this.options.maxSize || 30;
    } else {
      intensity = new Intensity({
        min: this.pointCountMin,
        max: this.pointCountMax,
        minSize: this.options.minSize || 8,
        maxSize: this.options.maxSize || 30,
        gradient: this.options.gradient,
      });
    }
    for (let i = 0; i < clusterData.length; i++) {
      let item = clusterData[i];
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
    let data = self.clusterDataSet.get(dataGetOptions);
    return data;
  }

  refreshCluster(options) {
    options = options || this.options;
    this.supercluster = new Supercluster({
      maxZoom: options.maxZoom || 19,
      radius: options.clusterRadius || 100,
      minPoints: options.minPoints || 2,
      extent: options.extent || 512,
    });

    this.supercluster.load(this.dataSet.get());
    // 拿到每个级别下的最大值最小值
    this.supercluster.trees.forEach((item) => {
      let max = 0;
      let min = Infinity;
      item.points.forEach((point) => {
        max = Math.max(point.numPoints || 0, max);
        min = Math.min(point.numPoints || Infinity, min);
      });
      item.max = max;
      item.min = min;
    });
    this.clusterDataSet = new DataSet();
  }

  _canvasUpdate(time) {
    let map = this.map;
    let scene = this.scene;
    if (!this.canvasLayer || this.stopAniamation) {
      return;
    }
    let self = this;

    let animationOptions = self.options.animation;

    let context = self.getContext();

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
      for (let key in self.options) {
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

    let dataGetOptions = this.dataOptions();

    if (time !== undefined) {
      dataGetOptions.filter = function (item) {
        let trails = animationOptions.trails || 10;
        if (time && item.time > time - trails && item.time < time) {
          return true;
        } else {
          return false;
        }
      };
    }

    let data;
    let zoom = this.getZoom();
    if (
      this.options.draw === "cluster" &&
      (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)
    ) {
      data = this.changeCluster();
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

    let pixel = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      Cesium.Cartesian3.fromDegrees(0, 0)
    );
    if (!pixel) pixel = [0, 0];
    this.drawContext(context, new DataSet(data), self.options, pixel);

    self.options.updateCallback && self.options.updateCallback(time);
  }

  updateData(data, options) {
    let _data = data;
    if (_data && _data.get) {
      _data = _data.get();
    }
    if (_data != undefined) {
      let zoom = this.getZoom();
      if (
        this.options.draw === "cluster" &&
        (!this.options.maxClusterZoom || this.options.maxClusterZoom >= zoom)
      ) {
        this.dataSet = data;
        this.refreshCluster(this.options);
        _data = this.changeCluster();
        this.dataSet.set(_data);
      } else {
        this.dataSet.set(_data);
      }
    }

    super.update({
      options: options,
    });
  }

  addData(data, options) {
    let _data = data;
    if (data && data.get) {
      _data = data.get();
    }
    this.dataSet.add(_data);
    this.update({
      options: options,
    });
  }

  getData() {
    return this.dataSet;
  }

  removeData(filter) {
    if (!this.dataSet) {
      return;
    }
    let newData = this.dataSet.get({
      filter: function (data) {
        return filter != null && typeof filter === "function"
          ? !filter(data)
          : true;
      },
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
