export default {
  /**
   * @type String
   * @description 该key的主要作用市用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的引用，从而避免vue对cesium的内存劫持
   */
  vueKey: { typs: String, default: "default" },
  /**
   * @type String
   * @description 该key的主要作用市用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
   */
  vueIndex: {
    typs: String | Number,
    default: (Math.random() * 10000).toFixed(0)
  },
  /**
   * @type Cesium.Resource.headers
   * @example headers: { "szvsud-license-key": '3AE2IROq5nGn5K/+zQlUxSoHoNdjCoS1l5567rK5SKjHfRbQIvhtbInd7S9X6bFl' },
   */
  headers: {},
  url: { required: true },
  show: { typs: Boolean, default: true },
  autoReset: { typs: Boolean, default: true },

  /**
   * @type Cesium.Matrix4
   * @default Matrix4.IDENTITY
   */
  /* modelMatrix: { typs: Object, default: undefined }, */
  /**
   * @type Cesium.ShadowMode
   * @default ShadowMode.ENABLED
   */
  /* shadows: { type: Object, default: undefined }, */

  maximumScreenSpaceError: { type: Number, default: 16 },
  maximumMemoryUsage: { type: Number, default: 512 },

  cullWithChildrenBounds: { typs: Boolean, default: true },
  cullRequestsWhileMoving: { typs: Boolean, default: true },
  cullRequestsWhileMovingMultiplier: { type: Number, default: 60.0 },

  preloadWhenHidden: { typs: Boolean, default: false },
  preloadFlightDestinations: { typs: Boolean, default: true },
  preferLeaves: { typs: Boolean, default: false },

  dynamicScreenSpaceError: { typs: Boolean, default: false },
  dynamicScreenSpaceErrorDensity: { type: Number, default: 0.00278 },
  dynamicScreenSpaceErrorFactor: { type: Number, default: 4.0 },
  dynamicScreenSpaceErrorHeightFalloff: { type: Number, default: 0.25 },

  progressiveResolutionHeightFraction: { type: Number, default: 0.3 },

  foveatedScreenSpaceError: { typs: Boolean, default: true },
  foveatedConeSize: { type: Number, default: 0.1 },
  foveatedMinimumScreenSpaceErrorRelaxation: { type: Number, default: 0.0 },
  /**
   * @type Cesium3DTileset~foveatedInterpolationCallback
   * @default Cesium.Math.lerp
   */
  /* foveatedInterpolationCallback: { type: Function, default: undefined }, */
  foveatedTimeDelay: { type: Number, default: 0.2 },

  skipLevelOfDetail: { typs: Boolean, default: false },
  baseScreenSpaceError: { type: Number, default: 1024 },
  skipScreenSpaceErrorFactor: { type: Number, default: 16 },
  skipLevels: { type: Number, default: 1 },

  immediatelyLoadDesiredLevelOfDetail: { typs: Boolean, default: false },
  loadSiblings: { typs: Boolean, default: false },

  /**
   * @type Cesium.ClippingPlaneCollection
   */
  /* clippingPlanes: { typs: Object, default: undefined }, */
  /**
   * @type Cesium.ClassificationType
   */
  /* classificationType: { typs: Object, default: undefined }, */
  /**
   * @type Cesium.Ellipsoid
   * @default Ellipsoid.WGS84
   */
  /* ellipsoid: { typs: Object, default: undefined }, */

  /* pointCloudShading: { typs: Object, default: undefined }, */
  /**
   * @type Cartesian2
   * @default new Cartesian2(1.0, 1.0)
   */
  /* imageBasedLightingFactor: { typs: Object, default: undefined }, */
  /**
   * @type Cartesian3
   */
  /* lightColor: { typs: Object, default: undefined }, */
  luminanceAtZenith: { type: Number, default: 0.2 },
  /**
   * @type Array.<Cartesian3>
   */
  /* sphericalHarmonicCoefficients: { type: Array, default: undefined }, */
  specularEnvironmentMaps: { type: String, default: "" },

  debugHeatmapTilePropertyName: { type: String, default: "" },
  debugFreezeFrame: { typs: Boolean, default: false },
  debugColorizeTiles: { typs: Boolean, default: false },
  debugWireframe: { typs: Boolean, default: false },
  debugShowBoundingVolume: { typs: Boolean, default: false },
  debugShowContentBoundingVolume: { typs: Boolean, default: false },
  debugShowViewerRequestVolume: { typs: Boolean, default: false },
  debugShowGeometricError: { typs: Boolean, default: false },
  debugShowRenderingStatistics: { typs: Boolean, default: false },
  debugShowMemoryUsage: { typs: Boolean, default: false },
  debugShowUrl: { typs: Boolean, default: false }
};
