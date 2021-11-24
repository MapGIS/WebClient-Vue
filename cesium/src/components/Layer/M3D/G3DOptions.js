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
    type: [String, Number],
    default: () => (Math.random() * 100000000).toFixed(0)
  },

  outStyle: {
    type: Object,
    default: () => {
      return {
        position: "absolute",
          zIndex: 1000,
          height: "450px",
          width: "270px",
          top: "10px",
          left: "10px",
          padding: "2px",
      };
    }
  },

  /**
   * @description g3d网络请求地址
   */
  url: { type: String, required: true },

  autoReset: { type: Boolean, default: true },
  /**
   * @description 是否异步请求
   */
  synchronous: { type: Boolean, default: true },
  /**
   * @description 是否显示包围盒
   */
  showBoundingVolume: { type: Boolean, default: false },
  /**
   * 用于控制模型显示细节 值较大将会渲染更少的贴图,进而可以提高性能,而较低的值将提高视觉质量
   */
  maximumScreenSpaceError: { type: Number, default: 16 },
  /**
   * @description 图层过滤功能
   */
  layers: { type: [String], default: undefined },
  /**
   * @description 是否使用前端缓存
   */
  useIDB: { type: Boolean, default: false },
  /**
   * @description 前端最大缓存级别
   */
  maxCacheLevel: { type: Boolean, default: false },
  /**
   * @description 矢量图层单个瓦片加载的矢量要素数量
   */
  tileFeaturesCount: { type: Number, default: 400 },
  /**
   * @description 跳转时间，以秒为单位
   */
  duration: { type: Number, default: 0 },
  /**
   * @description 镜头朝向
   * @see Cesium.HeadingPitchRange
   * @default new HeadingPitchRange(0.0, -0.5, mergeBoundingSphere.radius * 2.5
   */
  orientation: { type: Object, default: 0 },
  /**
   * @description 代理
   */
  proxy: { type: Object }
};
