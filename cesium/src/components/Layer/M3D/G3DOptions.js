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

  /**
   * @description 图层过滤功能:'show:0,1'表示显示第0，1个图层，'hide:0，2'表示隐藏第0，2个图层
   */
  layerId: {
    type: String
  },

  /**
   * @description g3d网络请求地址
   */
  url: { type: String, required: true },

  /**
   * @description 图层透明度
   */
  opacity: { type: Number, default: 1 },

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
  layers: { type: String, default: undefined },
  /**
   * @description 是否使用前端缓存
   */
  useIDB: { type: Boolean, default: false },
  /**
   * @description 前端最大缓存级别
   */
  maxCacheLevel: { type: Number, default: 3 },
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
  orientation: { type: Object },
  /**
   * @description 是否激活地形法向量
   */
  requestVertexNormals: { type: Boolean, default: false },
  /**
   * @description 代理
   */
  proxy: { type: Object },
  /**
   * @description 是否激活查询弹窗
   */
  enablePopup: { type: Boolean, default: false },
  /**
   * @description 是否激活默认UI
   */
  enableControl: { type: Boolean, default: false },

  outStyle: {
    type: Object,
    default: () => {
      return {
        position: "absolute",
        zIndex: 1000,
        height: "450px",
        width: "270px",
        top: "0px",
        left: "0px"
      };
    }
  }
};
