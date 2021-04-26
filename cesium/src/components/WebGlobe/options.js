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
    typs: [String, Number],
    default: (Math.random() * 10000).toFixed(0)
  },
  container: {
    type: [String, HTMLElement],
    default() {
      return `cesium-${("" + Math.random()).split(".")[1]}`;
    }
  },
  keyEventEnable: {
    type: Boolean,
    default: true
  },
  /**
   * @description 初始视图模式默认为三维球视图 '2D'表示二维视图 'COLUMBUS_VIEW' 表示三维平面视图
   */
  viewerMode: {
    type: String,
    default: "3D"
  },
  /**
   * @description 是否显示默认的属性信息框
   */
  showInfo: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认动画控制不显示
   */
  animation: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认时间轴控制不显示
   */
  timeline: {
    type: Boolean,
    default: false
  },
  /**
   * @description If set to false, the BaseLayerPicker widget will not be created.
   */
  baseLayerPicker: {
    type: Boolean,
    default: false
  },
  /**
   * @description If set to false, the FullscreenButton widget will not be created.
   */
  fullscreenButton: {
    type: Boolean,
    default: false
  },
  /**
   * @description If set to true, the VRButton widget will be created.
   */
  vrButton: {
    type: Boolean,
    default: false
  },
  contextOptions: {
    type: Object,
    default: function() {
      return {
        webgl: {
          preserveDrawingBuffer: true
        }
      };
    }
  },
  cameraView: {
    type: Object,
    default: function() {
      return {
        destination: {
          x: -5087907.392038159,
          y: 14207074.175879652,
          z: 3655215.2541255946
        },
        orientation: {
          heading: 6.1827568973283045,
          pitch: -1.2409374391413084,
          roll: 0.0003114284469649675
        }
      };
    }
  }
};
