export default {
  /**
   * @type String
   * @description 该key的主要作用市用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的引用，从而避免vue对cesium的内存劫持
   */
  vueKey: { typs: String, default: "default" },
  /**
   * @type String
   * @description 该key的主要作用是用来记录Cesium的Source,primitive,
   * entity的内存中的引用数组的下标，从而避免vue对cesium的内存劫持
   */
  vueIndex: {
    typs: [String, Number],
    default: () => (Math.random() * 1000000).toFixed(0),
  },
  company: {
    type: String,
    default: "mapgis-1.10-dev",
  },
  theme: {
    type: String,
    default: "bg-accent text-white",
  },
  color: {
    type: String,
    default: "blue-grey-11",
  },
  autoResize: {
    type: Boolean,
    default: true,
  },
  container: {
    type: [String, HTMLElement],
    default() {
      return `map-${("" + Math.random()).split(".")[1]}`;
    },
  },
  serverUrl: {
    type: String,
    default: "https://develop.smaryun.com:6163",
  },
  mapClass: {
    type: String,
    default: "mapbox-default-map",
  },
  crs: {
    type: String,
    default: "EPSG:3857",
  },
  accessToken: {
    type: String,
    default: undefined,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  maxZoom: {
    type: Number,
    default: 22,
  },
  mapStyle: {
    type: [String, Object],
    default: () => {
      return {
        version: 8,
        sources: {},
        layers: [
          {
            id: "背景",
            type: "background",
            paint: {
              "background-color": "rgba(0, 0, 0, 1)",
            },
          },
        ],
      };
    },
  },
  hash: {
    type: Boolean,
    default: false,
  },
  interactive: {
    type: Boolean,
    default: true,
  },
  bearingSnap: {
    type: Number,
    default: 7,
  },
  pitchWithRotate: {
    type: Boolean,
    default: true,
  },
  clickTolerance: {
    type: Number,
    default: 3,
  },
  // classes: {
  //   type: Array,
  //   default() {
  //     return []
  //   }
  // },
  attributionControl: {
    type: Boolean,
    default: true,
  },
  customAttribution: {
    type: [String, Array],
    default: null,
  },
  logoPosition: {
    type: String,
    default: "bottom-left",
    validator: (val) =>
      ["top-left", "top-right", "bottom-left", "bottom-right"].includes(val),
  },
  failIfMajorPerformanceCaveat: {
    type: Boolean,
    default: false,
  },
  preserveDrawingBuffer: {
    type: Boolean,
    default: false,
  },
  refreshExpiredTiles: {
    type: Boolean,
    default: true,
  },
  maxBounds: {
    type: Array,
    default() {
      return [
        [-179, -89],
        [179, 89],
      ];
    },
  },
  scrollZoom: {
    type: [Boolean, Object],
    default() {
      return true;
    },
  },
  boxZoom: {
    type: Boolean,
    default: true,
  },
  dragRotate: {
    type: Boolean,
    default: true,
  },
  dragPan: {
    type: Boolean,
    default: true,
  },
  keyboard: {
    type: Boolean,
    default: true,
  },
  doubleClickZoom: {
    type: Boolean,
    default: true,
  },
  touchZoomRotate: {
    type: [Boolean, Object],
    default() {
      return true;
    },
  },
  trackResize: {
    type: Boolean,
    default: true,
  },
  center: {
    type: [Object, Array],
    default: undefined,
  },
  zoom: {
    type: Number,
    default: 0,
  },
  bearing: {
    type: Number,
    default: 0,
  },
  pitch: {
    type: Number,
    default: 0,
  },
  bounds: {
    type: [Object, Array],
    default: undefined,
  },
  fitBoundsOptions: {
    type: Object,
    default: undefined,
  },
  renderWorldCopies: {
    type: Boolean,
    default: true,
  },
  RTLTextPluginUrl: {
    type: String,
    default: undefined,
  },
  light: {
    type: Object,
    default: undefined,
  },
  tileBoundaries: {
    type: Boolean,
    default: false,
  },
  collisionBoxes: {
    type: Boolean,
    default: false,
  },
  repaint: {
    type: Boolean,
    default: false,
  },
  transformRequest: {
    type: Function,
    default: null,
  },
  maxTileCacheSize: {
    type: Number,
    default: null,
  },
  localIdeographFontFamily: {
    type: String,
    default: null,
  },
  collectResourceTiming: {
    type: Boolean,
    default: false,
  },
  fadeDuration: {
    type: Number,
    default: 300,
  },
  crossSourceCollisions: {
    type: Boolean,
    default: true,
  },
};
