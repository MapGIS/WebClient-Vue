export default {
    geojson: { type: Object, required: true },
    /**
     * @description 用来描述igserver发布的瓦片错级的问题,常用于自定义切图
     */
    field: { type: Object, default: () => {
      return {
        count: 'count',
        time: 'time',
      }
    } },
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