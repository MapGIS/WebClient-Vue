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
    default: () => (Math.random() * 100000000).toFixed(0)
  },
  /**
   * @param {Entity} [position.entity]  实体,内部获取坐标点cartesian, 输入此参数可忽略下面的，cartesian，longitude,latitude
   * @param {Cartesian3} [position.cartesian] 笛卡尔积坐标点cartesian, 输入此参数可忽略下面的longitude,latitude
   * @param {Number} [position.longitude] 经度, 先判断cartesian是否存在，存在忽略此参数
   * @param {Number} [position.latitude] 纬度, 先判断cartesian是否存在，存在忽略此参数
   * @param {Number}  [position.height] 高度, 可选 默认0
   */
  position: {
    type: Object,
    required: true
  },
  /**
   * @param {String} [options.popupId] 本次popup对应的唯一id,不传随机生成
   * @param {String} [options.popupContentId] 本次popup对应的唯一内容id
   * @param {Boolean} [options.postRender=true] 是否实时渲染
   * @param {Boolean} [options.showClose=true]  是否显示关闭按钮
   */
  options: {
    type: Object,
    default: () => {
      return {
        postRender: true
      };
    }
  },
  /**
   * @param {String} container 外部传入的div的字符串描述方式，一般是文字或者echarts的div;
   */
  container: {
    type: String,
    default: "<div>空</div>"
  },

  /**
   *  @param {Boolean} visible(v-model) 对话框是否可见
   */
  visible: {
    type: Boolean,
    default: true
  },

  /**
   * @param {Boolean} destroyOnClose 关闭时销毁 Modal 里的子元素
   */
  destroyOnClose: {
    type: Boolean,
    default: false
  },

  /**
   * @param {Boolean} forceRender 强制渲染poup显示的Dom元素
   */  
  forceRender: {
    type: Boolean,
    default: false
  }
};
