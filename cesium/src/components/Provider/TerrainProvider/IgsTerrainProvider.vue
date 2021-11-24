<script>
import VueOptions from "../../Base/Vue/VueOptions";

export default {
  name: "mapgis-3d-igs-terrain",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    autoReset: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
    },
    // scale: {
    //   type: Number,
    //   default: 1,
    // },
    requestVertexNormals: {
      type: Boolean,
      default: false,
    },
    ...VueOptions,
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    show: function (next) {
      if (next) {
        this.mount();
      } else {
        this.unmount();
      }
    },
  },
  methods: {
    mount() {
      let vm = this;
      const { viewer, $props } = this;
      if (viewer.isDestroyed()) return
      let terrianlayer = viewer.scene.layers.appendG3DLayer(`${this.url}`, {
        ...$props,
        getDocLayerIndexes:vm._handleTerrianLoaded
      });
      this.$emit("load", this);
    },
    unmount() {
      const { viewer, vueKey, vueIndex } = this;
      let find = window.vueCesium.IgsTerrainManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        let terrains = find.source;
        if (!viewer.isDestroyed() && terrains) {
          terrains.forEach((l) => {
            l.destroy && l.destroy();
          });
          viewer.scene.layers.removeAllTerrainLayers();
        }
      }
      window.vueCesium.IgsTerrainManager.deleteSource(vueKey, vueIndex);
    },
    _handleTerrianLoaded(layers) {
      const { vueIndex, vueKey } = this;
      this.$emit("terrain-loaded", layers);
      if (vueKey && vueIndex) {
        window.vueCesium.IgsTerrainManager.addSource(
          vueKey,
          vueIndex,
          layers
        );
      }
    },
  },
  render(h) {
    return h("span", {
      class: "mapgis-3d-igs-terrain",
      ref: "m3d",
    });
  },
};
</script>
