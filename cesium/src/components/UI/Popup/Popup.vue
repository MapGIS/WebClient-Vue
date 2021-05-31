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
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  watch: {
    position: {
      deep: true,
      handler() {
        this.update();
      }
    },
    showed: {
      deep: true,
      handler() {
        this.update();
      }
    }
  },
  mounted() {
    this.update();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    createCesiumObject() {
      let { webGlobe, CesiumZondy, position, options, container } = this;

      if (this.$slots.default) {
        if (this.$slots.default[0].elm) {
          container = this.$slots.default[0].elm.innerHTML;
        } else if (this.$slots.default[0].context.$children[0].$el) {
          container = this.$slots.default[0].context.$children[0].$el.innerHTML;
        }
      }
      return new CesiumZondy.Overlayer.PopupLayer(
        webGlobe.viewer,
        position,
        options,
        container
      );
    },
    mount() {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
      let popup;

      let find = window.CesiumZondy.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      return !viewer.isDestroyed() && popup && popup.show();
    },
    unmount() {
      const { webGlobe, vueKey, vueIndex } = this;
      const viewer = webGlobe.viewer;
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
      const { webGlobe, CesiumZondy, vueIndex, vueKey } = this;
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

      if (this.showed) {
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
<style>
.cesium-popup {
  position: absolute;
  text-align: center;
}

.cesium-popup-close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  text-align: center;
  width: 18px;
  height: 14px;
  font: 16px/14px Tahoma, Verdana, sans-serif;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
}

.cesium-popup-content-wrapper {
  text-align: left;
  padding: 10px;
  overflow-y: auto;
  font-size: 1.2em;
  z-index: 9999;
  border: 2px solid #46bcf1;
  box-shadow: 0px 0px 20px #46bcf1;
  -moz-box-shadow: 0px 0px 20px #46bcf1;
  -webkit-box-shadow: 0px 0px 20px #46bcf1;
  border-radius: 3px 3px 3px 3px;
  background: #46bcf188;
  background-size: 50% 50%;
  background-repeat: no-repeat;
}

.cesium-popup-content {
}

.cesium-popup-tip-container {
  margin: 0 auto;
  width: 40px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.cesium-popup-tip {
  background: #46bcf1;
  box-shadow: 0 3px 14px #46bcf1;
  width: 17px;
  height: 17px;
  padding: 1px;
  margin: -10px auto 0;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
