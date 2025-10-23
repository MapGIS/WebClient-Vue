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
    default: () => (Math.random() * 100000000).toFixed(0),
  },

  /**
   * @description 图层过滤功能:'show:0,1'表示显示第0，1个图层，'hide:0，2'表示隐藏第0，2个图层
   */
  layerId: {
    type: String,
  },

  /**
   * @description g3d网络请求地址
   */
  url: { type: String, required: true },

  /**
   * @description 图层透明度
   */
  opacity: { type: Number, default: 1 },

  /**
   * @description 图层ID，用于修改指定图层透明度
   */
  opacityLayersArray: {
    type: Array,
    default() {
      return [];
    },
  },

  autoReset: { type: Boolean, default: true },

  // 剖切封边
  fillClip: { type: Boolean, default: false },

  // 是否会存在剖面几何,用于折线剖面
  hasSectionGeometry: { type: Boolean, default: false },

  /**
   * @description 是否显示包围盒
   */
  showBoundingVolume: { type: Boolean, default: false },
  /**
   * 用于控制模型显示细节 值较大将会渲染更少的贴图,进而可以提高性能,而较低的值将提高视觉质量
   */
  maximumScreenSpaceError: { type: Number, default: 16 },
  /**
   * @description 模型最大内存使用量
   */
  maximumCacheOverflowBytes: { type: Number, default: 536870912 },
  /**
   * @description 图层过滤功能
   */
  layers: { type: String, default: undefined },
  /**
   * @description 跳转时间，以秒为单位
   */
  duration: { type: Number, default: 1 },
  /**
   * @description 是否激活地形法向量
   */
  requestVertexNormals: { type: Boolean, default: false },
  /**
   * @description 是否激活查询弹窗
   */
  enablePopup: { type: Boolean, default: false },
  // 扩展属性，以支持通过对象的方式批量传入图层属性，
  // 但是优先级低于单个传入属性，即如果单个属性有传入值，优先使用传入的值，
  // 如果没有传入，但是extensions中有该属性，则使用extensions里对应的值
  // 修改者：龚跃健 2024/10/28
  extensions: { type: Object },
};
