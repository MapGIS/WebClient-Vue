import TilesetOptions from "./3DTilesetOptions";

export default {
  props: { ...TilesetOptions },
  inject: ["Cesium", "viewer"],
  created() {},
  mounted() {
    this.mount();
    // this.watchProp();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      const { $props } = this;
      return new Cesium.Cesium3DTileset($props);
    },
    watchProp() {
      let { show } = this;
      if (show) {
        this.$watch("show", function (next) {
          if (this.initial) return;
          // this.tileset.show = next;
        });
      }
    },
    mount() {
      const { viewer, autoReset, vueIndex, vueKey } = this;
      const vm = this;
      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let tileset = this.createCesiumObject();

      if (vueKey && vueIndex) {
        window.vueCesium.Tileset3DManager.addSource(vueKey, vueIndex, tileset);
      }
      viewer.scene.primitives.add(tileset);

      tileset.readyPromise
        .then(function (primitives) {
          vm.$emit("loaded", { tileset: tileset });
          if (autoReset) {
            viewer.zoomTo(
              primitives,
              new Cesium.HeadingPitchRange(
                0.0,
                -0.5,
                primitives.boundingSphere.radius * 2.0
              )
            );
          }
        })
        .otherwise(function (error) {
          console.error("3dtileset", error);
        });
    },
    unmount() {
      const { viewer, vueKey, vueIndex } = this;
      let find = window.vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        !viewer.isDestroyed() && viewer.scene.primitives.remove(find.source);
      }
      this.$emit("unload");
      window.vueCesium.Tileset3DManager.deleteSource(vueKey, vueIndex);
    },
  },
  render(createElement) {
    return createElement("span");
  },
};
