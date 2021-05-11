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
    default: (Math.random() * 10000).toFixed(0)
  },
  /**
   * @type Cesium.Resource.headers
   * @example headers: { "szvsud-license-key": '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5567rK5SKjHfRbQIvhtbInd7S9X6bFl' },
   */
  headers: {},
  url: { type: String, required: true },
  show: { type: Boolean, default: true },
  autoReset: { type: Boolean, default: true },

  /**
   * @type Cesium.Matrix4
   * @default Matrix4.IDENTITY
   */
  /* modelMatrix: { type: Object, default: undefined }, */
  /**
   * @type Cesium.ShadowMode
   * @default ShadowMode.ENABLED
   */
  /* shadows: { type: Object, default: undefined }, */

  maximumScreenSpaceError: { type: Number, default: 16 },
  maximumMemoryUsage: { type: Number, default: 512 },

  cullWithChildrenBounds: { type: Boolean, default: true },
  cullRequestsWhileMoving: { type: Boolean, default: true },
  cullRequestsWhileMovingMultiplier: { type: Number, default: 60.0 },

  preloadWhenHidden: { type: Boolean, default: false },
  preloadFlightDestinations: { type: Boolean, default: true },
  preferLeaves: { type: Boolean, default: false },

  dynamicScreenSpaceError: { type: Boolean, default: false },
  dynamicScreenSpaceErrorDensity: { type: Number, default: 0.00278 },
  dynamicScreenSpaceErrorFactor: { type: Number, default: 4.0 },
  dynamicScreenSpaceErrorHeightFalloff: { type: Number, default: 0.25 },

  progressiveResolutionHeightFraction: { type: Number, default: 0.3 },

  foveatedScreenSpaceError: { type: Boolean, default: true },
  foveatedConeSize: { type: Number, default: 0.1 },
  foveatedMinimumScreenSpaceErrorRelaxation: { type: Number, default: 0.0 },
  /**
   * @type Cesium3DTileset~foveatedInterpolationCallback
   * @default Cesium.Math.lerp
   */
  /* foveatedInterpolationCallback: { type: Function, default: undefined }, */
  foveatedTimeDelay: { type: Number, default: 0.2 },

  skipLevelOfDetail: { type: Boolean, default: false },
  baseScreenSpaceError: { type: Number, default: 1024 },
  skipScreenSpaceErrorFactor: { type: Number, default: 16 },
  skipLevels: { type: Number, default: 1 },

  immediatelyLoadDesiredLevelOfDetail: { type: Boolean, default: false },
  loadSiblings: { type: Boolean, default: false },

  /**
   * @type Cesium.ClippingPlaneCollection
   */
  /* clippingPlanes: { type: Object, default: undefined }, */
  /**
   * @type Cesium.ClassificationType
   */
  /* classificationType: { type: Object, default: undefined }, */
  /**
   * @type Cesium.Ellipsoid
   * @default Ellipsoid.WGS84
   */
  /* ellipsoid: { type: Object, default: undefined }, */

  /* pointCloudShading: { type: Object, default: undefined }, */
  /**
   * @type Cartesian2
   * @default new Cartesian2(1.0, 1.0)
   */
  /* imageBasedLightingFactor: { type: Object, default: undefined }, */
  /**
   * @type Cartesian3
   */
  /* lightColor: { type: Object, default: undefined }, */
  luminanceAtZenith: { type: Number, default: 0.2 },
  /**
   * @type Array.<Cartesian3>
   */
  /* sphericalHarmonicCoefficients: { type: Array, default: undefined }, */
  specularEnvironmentMaps: { type: String, default: "" },

  debugHeatmapTilePropertyName: { type: String, default: "" },
  debugFreezeFrame: { type: Boolean, default: false },
  debugColorizeTiles: { type: Boolean, default: false },
  debugWireframe: { type: Boolean, default: false },
  debugShowBoundingVolume: { type: Boolean, default: false },
  debugShowContentBoundingVolume: { type: Boolean, default: false },
  debugShowViewerRequestVolume: { type: Boolean, default: false },
  debugShowGeometricError: { type: Boolean, default: false },
  debugShowRenderingStatistics: { type: Boolean, default: false },
  debugShowMemoryUsage: { type: Boolean, default: false },
  debugShowUrl: { type: Boolean, default: false }
};
