import CesiumCommon from '../Cesium/CesiumCommon'
import VueVirtualNode from './VueVirtualNode'
/**
 * VueCesium 的基础虚拟组件，mixin 注入需要实现以下方法。
 */
export default {
  mixins: [VueVirtualNode, CesiumCommon],
  methods: {
    /**
     * 获取注入对象。
     * @returns {Object}
     */
    getServices () {
      return CesiumCommon.methods.getServices.call(this)
    },
    /**
     * 加载组件。
     * @returns {Promise}
     */
    load () {
      return CesiumCommon.methods.load.call(this)
    },
    /**
     * 重载组件。
     * @returns {Promise}
     */
    reload () {
      return CesiumCommon.methods.reload.call(this)
    },
    /**
     * 卸载组件。
     * @return {Promise}
     */
    unload () {
      return CesiumCommon.methods.unload.call(this)
    }
  }
}
