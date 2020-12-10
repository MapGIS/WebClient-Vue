
import CustomImageryProvider from './CustomImageryProvider.vue'

function plugin (Vue, options = {}) {
  if (plugin.installed) {
    return
  }
  plugin.installed = true

  Vue.component(CustomImageryProvider.name, CustomImageryProvider)
}

export default plugin

export {
  CustomImageryProvider,
  plugin as install
}
