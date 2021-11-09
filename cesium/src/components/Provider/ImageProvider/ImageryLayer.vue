<script>
import ImageryOptions from "./ImageryOptions";
export default {
  name: 'cesium-layer-imagery',
  mixins: [],
  inject: ["Cesium", "viewer"],
  props: {
    ...ImageryOptions
  },
  methods: {
    /**
     * ImageryLayer 初始化方式较为特殊，这儿覆盖重写 createCesiumObject 方法。
     */
    async createCesiumObject () {
      const { $props } = this
      return new Cesium.ImageryLayer(provider || {}, $props)
    },
    async mount () {
      const { viewer, imageryLayer } = this
      viewer.imageryLayers.add(imageryLayer)
      return !this.viewer.isDestroyed() && viewer.imageryLayers.contains(imageryLayer)
    },
    async unmount () {
      const { viewer, imageryLayer } = this
      return !viewer.isDestroyed() && viewer.imageryLayers.remove(imageryLayer)
    },
    /* async refresh () {
      return this.unmount().then(() => {
        return this.createCesiumObject().then(cesiumObject => {
          this.originInstance = cesiumObject
          return this.mount()
        })
      })
    },
    setProvider (provider) {
      if (provider !== this._provider) {
        this._provider = provider
        provider && this.refresh()
        const listener = this.$listeners['update:imageryProvider']
        if (listener) this.$emit('update:imageryProvider', provider)
      }
    }, */
  },
  created () {
    this._provider = undefined
    Object.defineProperties(this, {
      imageryLayer: {
        enumerable: true,
        get: () => this.originInstance
      },
      provider: {
        enumerable: true,
        get: () => this.imageryProvider || this._provider
      }
    })
  }
}
</script>
