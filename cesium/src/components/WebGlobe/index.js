
import WebGlobe from './WebGlobe.vue'

function plugin (Vue, options = {}) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true
  Vue.prototype._Cesium = () => options
  Vue.component(WebGlobe.name, WebGlobe)
}

export default plugin

export {
  WebGlobe,
  plugin as install
}
