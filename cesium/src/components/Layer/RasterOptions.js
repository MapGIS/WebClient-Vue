export default {
  url: { type: String, default: null },

  domain: {
    type: String,
    default: null
  },
  protocol: {
    type: String,
    default: location.protocol.split(":")[0] || "http"
  },
  ip: {
    type: String,
    default: "localhost"
  },
  port: {
    type: String,
    default: "6163"
  },

  colNum: { type: Number, default: 2 },
  rowNum: { type: Number, default: 1 },
  /**
   * @description 用来描述igserver发布的瓦片错级的问题,常用于自定义切图
   */
  offset: { type: Number, default: 0 },
  show: { typs: Boolean, default: true },
  alpha: { typs: Number, default: 1.0 },
  proxy: { type: String, default: undefined },
  /**
   * @example
   * new Cesium.GeographicTilingScheme({
        rectangle:new Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
        ellipsoid: Cesium.Ellipsoid.WGS84,
        numberOfLevelZeroTilesX: 2,
        numberOfLevelZeroTilesY: 1,
      })
   */
  tilingScheme: { type: Object, default: undefined },
  /**
   * @example new Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
   */
  rectangle: { type: Object, default: undefined },

  tileDiscardPolicy: {},
  tileHeight: { type: Number, default: 256 },
  tileWidth: { type: Number, default: 256 },

  enablePickFeatures: {},

  minimumLevel: { type: Number, default: 0 },
  maximumLevel: { type: Number, default: 20 },

  credit: {}
};
