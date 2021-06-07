import mapboxgl from "@mapgis/mapbox-gl";
// import echarts from "echarts";
import * as echarts from "echarts";

export function MapCoordSys(MapboxGLMap, api) {
  this._MapboxGLMap = MapboxGLMap;
  this.dimensions = ["lng", "lat"];
  this._mapOffset = [0, 0];

  this._api = api;
}

MapCoordSys.prototype.dimensions = ["lng", "lat"];

MapCoordSys.prototype.setMapOffset = function(mapOffset) {
  this._mapOffset = mapOffset;
};

MapCoordSys.prototype.getBMap = function() {
  let map = window.EchartsZondy.mapboxglMap;
  // return this._MapboxGLMap;
  return map;
};

MapCoordSys.prototype.dataToPoint = function(data) {
  let map = window.EchartsZondy.mapboxglMap;
  // var px = this._MapboxGLMap.project(data);
  var px = map.project(data);

  var mapOffset = this._mapOffset;

  return [px.x - mapOffset[0], px.y - mapOffset[1]];
};

MapCoordSys.prototype.pointToData = function(pt) {
  var mapOffset = this._mapOffset;
  let map = window.EchartsZondy.mapboxglMap;
  // var pt = this._MapboxGLMap.project([
  //   pt[0] + mapOffset[0],
  //   pt[1] + mapOffset[1]
  // ]);
  var pt = map.project([pt[0] + mapOffset[0], pt[1] + mapOffset[1]]);
  return [pt.lng, pt.lat];
};

MapCoordSys.prototype.getViewRect = function() {
  var api = this._api;
  return new echarts.graphic.BoundingRect(
    0,
    0,
    api.getWidth(),
    api.getHeight()
  );
};

MapCoordSys.prototype.getRoamTransform = function() {
  return echarts.matrix.create();
};

//https://github.com/apache/incubator-echarts/issues/6953
//https://github.com/apache/incubator-echarts/issues/7789
MapCoordSys.prototype.prepareCustoms = function(data) {
  var zrUtil = echarts.util;

  var rect = this.getViewRect();
  return {
    coordSys: {
      // The name exposed to user is always 'cartesian2d' but not 'grid'.
      type: "mapboxgl",
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    api: {
      coord: zrUtil.bind(this.dataToPoint, this),
      size: zrUtil.bind(dataToCoordSize, this)
    }
  };

  function dataToCoordSize(dataSize, dataItem) {
    dataItem = dataItem || [0, 0];
    return zrUtil.map(
      [0, 1],
      function(dimIdx) {
        var val = dataItem[dimIdx];
        var halfSize = dataSize[dimIdx] / 2;
        var p1 = [];
        var p2 = [];
        p1[dimIdx] = val - halfSize;
        p2[dimIdx] = val + halfSize;
        p1[1 - dimIdx] = p2[1 - dimIdx] = dataItem[1 - dimIdx];
        return Math.abs(
          this.dataToPoint(p1)[dimIdx] - this.dataToPoint(p2)[dimIdx]
        );
      },
      this
    );
  }
};

// For deciding which dimensions to use when creating list data
MapCoordSys.dimensions = MapCoordSys.prototype.dimensions;

MapCoordSys.create = function(ecModel, api) {
  var coordSys;

  ecModel.eachComponent("mapboxgl", function(GLMapModel) {
    var viewportRoot = api.getZr().painter.getViewportRoot();
    // var MapboxGLMap = echarts.mapboxglMap;
    let map = window.EchartsZondy.mapboxglMap;
    coordSys = new MapCoordSys(map, api);
    coordSys.setMapOffset(GLMapModel.__mapOffset || [0, 0]);
    GLMapModel.coordinateSystem = coordSys;
  });

  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get("coordinateSystem") === "mapboxgl") {
      seriesModel.coordinateSystem = coordSys;
    }
  });
};

export default MapCoordSys;
