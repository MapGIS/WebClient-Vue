<template>
  <div style="display: none">
    <slot />
  </div>
</template>
<script>
import PopupOptions from "./PopupOptions";

export default {
  name: "mapgis-3d-popup",
  props: {
    ...PopupOptions
  },
  model: {
    prop: "visible",
    event: "change"
  },
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  watch: {
    position: {
      deep: true,
      handler() {
        this.update();
      }
    },
    visible: {
      deep: true,
      handler() {
        this.update();
      }
    }
  },
  updated() {
    if (this.forceRender) {
      this.update();
    }
  },
  mounted() {
    this.update();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    getWebGlobe() {
      let { webGlobe, vueKey, CesiumZondy } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      const { GlobesManager } = CesiumZondy;
      let instance = webGlobe;
      if (vueKey !== "default") {
        instance = GlobesManager[vueKey][0].source;
      }
      return instance;
    },
    createCesiumObject() {
      const vm = this;
      let { CesiumZondy, position, options, container, destroyOnClose } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;

      if (this.$slots.default) {
        if (this.$slots.default[0].elm) {
          container = this.$slots.default[0].elm || this.$slots.default[0].elm.innerHTML;
        } else if (this.$slots.default[0].context.$children[0].$el) {
          container = this.$slots.default[0].context.$children[0].$el.innerHTML;
        }
      }

      options = {
        ...options,
        callback: {
          onShow: () => {
            vm.$emit("change", true);
          },
          onHide: () => {
            vm.$emit("change", false);
            if (vm.destroyOnClose) {
              // 这里其实是无效的，本质上是通过update来实现的
              // vm.unmount();
            }
          }
        }
      };

      let webGlobe = this.getWebGlobe();

      return new CesiumZondy.Overlayer.PopupLayer(
        webGlobe.viewer,
        position,
        options,
        container
      );
    },
    mount() {
      let { webGlobe, vueKey, vueIndex } = this;
      webGlobe = webGlobe || this.getWebGlobe();
      const viewer = webGlobe.viewer;
      let popup;

      let find = window.CesiumZondy.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      return !viewer.isDestroyed() && popup && popup.show();
    },
    unmount() {
      let { webGlobe, vueKey, vueIndex } = this;
      webGlobe = webGlobe || this.getWebGlobe();
      const viewer = webGlobe.viewer;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      let popup;

      let find = window.CesiumZondy.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      if (popup) {
        popup.remove();
        popup = undefined;
      }
      return !viewer.isDestroyed();
    },
    update() {
      let { CesiumZondy, vueIndex, vueKey } = this;
      CesiumZondy = CesiumZondy || window.CesiumZondy;
      let popup;
      let find = CesiumZondy.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      if (popup && popup.remove) {
        popup.remove();
        popup = undefined;
        CesiumZondy.PopupManager.deleteSource(vueKey, vueIndex);
      }

      if (this.visible) {
        popup = this.createCesiumObject();
        this.$emit("load", { popup: popup });
        if (vueKey && (vueIndex || vueIndex === 0)) {
          CesiumZondy.PopupManager.addSource(vueKey, vueIndex, popup);
        }
        this.mount();
      }
    },
    removeAll() {
      let popups = window.CesiumZondy.PopupManager.findAllSource();
      popups.forEach(p => {
        let popup = p.source;
        popup && popup.remove();
      });
    }
  }
};
</script>
