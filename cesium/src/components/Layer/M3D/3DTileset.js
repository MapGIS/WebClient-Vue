import TilesetOptions from "./3DTilesetOptions";

export default {
  props: {
    ...TilesetOptions,
    // 右侧展示气泡框props
    popupShowType: {
      type: String,
      default: "default"
    },
    dataStoreIp: {
      type: String,
      default: "192.168.96.101"
    },
    dataStorePort: {
      type: String,
      default: "9014"
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1"
    },
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      }
    },
    token: {
      type: Object
    }
  },
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
        this.$watch("show", function(next) {
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

      const promise = this.createCesiumObject();
      promise.then(payload => {
        const { layerIndex } = payload;
        const layer = viewer.scene.layers.getCesium3DTilesetLayer(layerIndex);
      });

      // let tileset = this.createCesiumObject();
      // if (vueKey && vueIndex) {
      //   window.vueCesium.Tileset3DManager.addSource(vueKey, vueIndex, tileset);
      // }
      // viewer.scene.primitives.add(tileset);

      // tileset.readyPromise
      //   .then(function(primitives) {
      //     vm.$emit("loaded", { tileset: tileset });
      //     vm.bindPopupEvent();
      //     if (autoReset) {
      //       viewer.zoomTo(
      //         primitives,
      //         new Cesium.HeadingPitchRange(
      //           0.0,
      //           -0.5,
      //           primitives.boundingSphere.radius * 2.0
      //         )
      //       );
      //     }
      //   })
      //   .otherwise(function(error) {
      //     console.error("3dtileset", error);
      //   });
    },
    unmount() {
      const { viewer, vueKey, vueIndex } = this;
      let find = window.vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find) {
        !viewer.isDestroyed() && viewer.scene.primitives.remove(find.source);
      }
      this.feature = null;
      this.unbindPopupEvent();
      this.$emit("unload");
      window.vueCesium.Tileset3DManager.deleteSource(vueKey, vueIndex);
    },
    bindPopupEvent() {
      const { vueKey, vueIndex } = this;
      const { enablePopup, enableTips, enableModelSwitch } = this;

      let clickhandler, hoverhandler;
      if (enablePopup || enableModelSwitch) {
        clickhandler = this.$_bindClickEvent(
          this.pickFeature,
          this.cancelFeature
        );
      }
      if (enableTips) {
        hoverhandler = this.$_bindHoverEvent(this.pickFeature);
      }
      vueCesium.Tileset3DManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
      vueCesium.Tileset3DManager.changeOptions(
        vueKey,
        vueIndex,
        "hoverhandler",
        hoverhandler
      );
    },
    unbindPopupEvent() {
      const { vueCesium, vueKey, vueIndex } = this;
      let find = vueCesium.Tileset3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (find.options.clickhandler) {
          find.options.clickhandler.destroy();
        }
        if (find.options.hoverhandler) {
          find.options.hoverhandler.destroy();
        }
      }
      // 关闭右侧气泡框
      this.popupOverlay && this.popupOverlay.setContent(null);
      this.cancelFeature();
    }
  },
  render(createElement) {
    return createElement("span");
  }
};
