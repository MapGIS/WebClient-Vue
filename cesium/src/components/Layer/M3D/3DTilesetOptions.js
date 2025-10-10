import { Style } from "@mapgis/webclient-es6-service";
const { ModelStyle } = Style;

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

  highlightStyle: {
    type: String,
    default: "rgba(255, 255, 0, 0.6)",
  },

  /**
   * @type Cesium.Resource.headers
   * @example headers: { "szvsud-license-key": '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5567rK5SKjHfRbQIvhtbInd7S9X6bFl' },
   */
  headers: {},
  url: { type: String, required: true },
  show: { type: Boolean, default: true },
  opacity: { type: Number, default: 1 },
  autoReset: { type: Boolean, default: true },
  duration: { type: Number, default: 1 },

  // 剖切封边
  fillClip: { type: Boolean, default: false },

  // 是否会存在剖面几何,用于折线剖面
  hasSectionGeometry: { type: Boolean, default: false },

  offset: {
    type: Object,
  },

  scale: {
    type: Object,
  },

  maximumScreenSpaceError: { type: [Number, Array], default: 16 },
  maximumCacheOverflowBytes: { type: Number, default: 536870912 },

  cullWithChildrenBounds: { type: Boolean, default: true },
  cullRequestsWhileMoving: { type: Boolean, default: true },
  cullRequestsWhileMovingMultiplier: { type: Number, default: 60.0 },

  preloadWhenHidden: { type: Boolean, default: false },
  preloadFlightDestinations: { type: Boolean, default: true },
  preferLeaves: { type: Boolean, default: false },

  dynamicScreenSpaceError: { type: Boolean, default: true },
  dynamicScreenSpaceErrorDensity: { type: Number, default: 0.0002 },
  dynamicScreenSpaceErrorFactor: { type: Number, default: 24.0 },
  dynamicScreenSpaceErrorHeightFalloff: { type: Number, default: 0.25 },

  progressiveResolutionHeightFraction: { type: Number, default: 0.3 },

  foveatedScreenSpaceError: { type: Boolean, default: true },
  foveatedConeSize: { type: Number, default: 0.1 },
  foveatedMinimumScreenSpaceErrorRelaxation: { type: Number, default: 0.0 },
  foveatedTimeDelay: { type: Number, default: 0.2 },

  skipLevelOfDetail: { type: Boolean, default: false },
  baseScreenSpaceError: { type: Number, default: 1024 },
  skipScreenSpaceErrorFactor: { type: Number, default: 16 },
  skipLevels: { type: Number, default: 1 },

  immediatelyLoadDesiredLevelOfDetail: { type: Boolean, default: false },
  loadSiblings: { type: Boolean, default: false },

  luminanceAtZenith: { type: Number, default: 0.2 },

  debugHeatmapTilePropertyName: { type: String },
  debugFreezeFrame: { type: Boolean, default: false },
  debugColorizeTiles: { type: Boolean, default: false },
  debugWireframe: { type: Boolean, default: false },
  debugShowBoundingVolume: { type: Boolean, default: false },
  debugShowContentBoundingVolume: { type: Boolean, default: false },
  debugShowViewerRequestVolume: { type: Boolean, default: false },
  debugShowGeometricError: { type: Boolean, default: false },
  debugShowRenderingStatistics: { type: Boolean, default: false },
  debugShowMemoryUsage: { type: Boolean, default: false },
  debugShowUrl: { type: Boolean, default: false },

  // 扩展属性，以支持通过对象的方式批量传入图层属性，
  // 但是优先级低于单个传入属性，即如果单个属性有传入值，优先使用传入的值，
  // 如果没有传入，但是extensions中有该属性，则使用extensions里对应的值
  // 修改者：龚跃健 2024/10/28
  extensions: { type: Object },
};
