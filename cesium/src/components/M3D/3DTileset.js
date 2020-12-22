import TilesetOptions from "./3DTilesetOptions";

export default {
  props: { ...TilesetOptions },
  inject: ["Cesium", "webGlobe"],
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
        this.$watch("show", function(next) {
          if (this.initial) return;
          // this.tileset.show = next;
        });
      }
    },
    mount() {
      const { webGlobe, autoReset, vueIndex, vueKey } = this;
      const viewer = webGlobe.viewer;
      if (viewer.isDestroyed()) return;
      this.$emit("load", this);

      let tileset = this.createCesiumObject();

      if (vueKey && vueIndex) {
        window.CesiumZondy.Tileset3DManager.addSource(
          vueKey,
          vueIndex,
          tileset
        );
      }
      viewer.scene.primitives.add(tileset);

      tileset.readyPromise
        .then(function(primitives) {
          // viewer.scene.primitives.add(primitives);
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
        .otherwise(function(error) {
          console.error("3dtileset", error);
        });
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let find = window.CesiumZondy.Tileset3DManager.findSource(
        vueKey,
        vueIndex
      );
      if (find) {
        !viewer.isDestroyed() && viewer.scene.primitives.remove(find.source);
        find.source.destroy && find.source.destroy();
      }
      window.CesiumZondy.Tileset3DManager.deleteSource(vueKey, vueIndex);
    }
  },
  render(createElement) {
    return createElement("span");
  }
};
