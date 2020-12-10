import bindEvents from '../../Base/Cesium/CesiumBindEvent'
import { Events } from '../../Base/Cesium/CesiumEvents'

const methods = {
  async mount () {
    const { imageryProvider, providerContainer } = this
    imageryProvider.readyPromise.then(() => {
      const listener = this.$listeners['readyPromise']
      listener && this.$emit('readyPromise', imageryProvider)
    }).otherwise(error => {
      throw new Cesium.DeveloperError(error)
    })
    bindEvents.call(this, imageryProvider, Events['imagery-layer-events'], true)
    return providerContainer && providerContainer.setProvider(imageryProvider)
  },
  async unmount () {
    const { imageryProvider, providerContainer } = this
    bindEvents.call(this, imageryProvider, Events['imagery-layer-events'], false)
    return providerContainer && providerContainer.setProvider(undefined)
  }
}

export default {
  mixins: [],
  methods,
  created () {
    this.renderByParent = true
    this.provider = undefined
    Object.defineProperties(this, {
      imageryProvider: {
        enumerable: true,
        get: () => this.provider
      },
      providerContainer: {
        enumerable: true,
        get: () => this.$services && this.$services.providerContainer
      }
    })
  }
}
