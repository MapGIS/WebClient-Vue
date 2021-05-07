export default {
  /**
   * @type String
   * @description 该key的主要作用市用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的引用，从而避免vue对cesium的内存劫持
   */
  vueKey: { type: String, default: "default" },
  /**
   * @type String
   * @description 该key的主要作用市用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
   */
  vueIndex: {
    type: String | Number,
    default: (Math.random() * 10000).toFixed(0)
  },
  /**
   * @type Cesium.Resource.headers
   * @example headers: { "szvsud-license-key": '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5567rK5SKjHfRbQIvhtbInd7S9X6bFl' },
   */
  headers: {},

  /**
   * @description 地图服务ip
   */
  ip: { type: String },

  /**
   * @description 地图服务port
   */
  port: { type: Number },

  /**
   * @description 地图名
   */
  layerName: { type: String },

  /**
   * @description 样式json文件路径或者MVT-JSON对象，当为url时等于styleUrl；
   * 当为vectortilejson等于vectortilejson
   */
  mvtStyle: { type: String | Object },

  /**
   * @description 样式json文件路径,有styleUrl就可以直接读取styleUrl里的信息;不然就是加载中地发布的矢量瓦片，使用ip，port和layerName先拼接styleUrl路径再进行查询。
   */
  styleUrl: { type: String },

  /**
   * @description 矢量瓦片json对象,直接取json对象，不需要再去请求。
   */
  vectortilejson: { type: Object },

  /**
   * @type Cesium.TilingScheme
   * @description 矢量瓦片瓦片切分规则：经纬度还是墨卡托
   */
  tilingScheme: { type: Object },

  /**
   * @description 第三方需要的token，比如mapbox
   */
  token: { type: String },

  /**
   * @description 是否可见
   */
  show: { type: Boolean, default: true }
};
