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
    default: () => (Math.random() * 1000000).toFixed(0)
  },
  container: {
    type: [String, HTMLElement],
    default() {
      return `cesium-${("" + Math.random()).split(".")[1]}`;
    }
  },
  /**
   * @description 默认主页按钮不显示
   */
  homeButton: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认导航按钮不显示
   */
  navigationHelpButton: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认模型切换按钮不显示
   */
  sceneModePicker: {
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
   * @description 默认图层选择器不显示
   */
  baseLayerPicker: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认全屏控件不显示
   */
  fullscreenButton: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认VR控件不显示
   */
  vrButton: {
    type: Boolean,
    default: false
  },
  /**
   * @description 默认地理编码控件不显示
   */
  geocoder: {
    type: Boolean,
    default: false
  },

  /**
   * @link Cesium.SceneMode
   * @description 初始视图模式默认为三维球视图
   * COLUMBUS_VIEW: 1 SCENE2D: 2 SCENE3D: 3
   */
  sceneMode: {
    type: Number
  },

  /**
   * @description 默认时间轴控制不显示
   */
  timeline: {
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
        /* destination: {
          x: -5087907.392038159,
          y: 14207074.175879652,
          z: 3655215.2541255946
        },
        orientation: {
          heading: 6.1827568973283045,
          pitch: -1.2409374391413084,
          roll: 0.0003114284469649675
        } */
      };
    }
  }
};
