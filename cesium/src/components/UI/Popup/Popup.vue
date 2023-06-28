<template>
  <div style="display: none">
    <slot />
  </div>
</template>
<script>
import PopupOptions from "./PopupOptions";
import PopupLayer from "./PopupLayer";

export default {
  name: "mapgis-3d-popup",
  props: {
    ...PopupOptions,
    popupWapperStyle: {
      type: Object
    },
    popupHeaderStyle: {
      type: Object
    },
    popupCloseBtnStyle: {
      type: Object
    }
  },
  model: {
    prop: "visible",
    event: "change"
  },
  data() {
    return {
      longitude: 0, // 仅用于父级marker动态改变popup的data使用
      latitude: 0, // 仅用于父级marker动态改变popup的data使用
      height: 0, // 仅用于父级marker动态改变popup的data使用,
      show: true,
      isPopupOptionsChange: false,
      slotInnerHTML: ""
    };
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  watch: {
    position: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
        this.update();
      }
    },
    visible: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
        this.update();
      }
    },
    show: {
      deep: true,
      handler() {
        this.update();
      }
    },
    options: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
        this.update();
      }
    },
    popupWapperStyle: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
        this.update();
      }
    },
    popupHeaderStyle: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
        this.update();
      }
    },
    popupCloseBtnStyle: {
      deep: true,
      handler() {
        this.isPopupOptionsChange = true;
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
    togglePopup() {
      let value = !this.show;
      this.show = value;
    },
    getViewer() {
      let { viewer, vueKey, vueCesium } = this;
      vueCesium = vueCesium || window.vueCesium;
      let instance = viewer || vueCesium.getViewer(vueKey);
      return instance;
    },
    createCesiumObject() {
      const vm = this;
      let {
        Cesium,
        vueCesium,
        position,
        options,
        container,
        popupWapperStyle,
        popupCloseBtnStyle,
        popupHeaderStyle
      } = this;
      vueCesium = vueCesium || window.vueCesium;

      if (this.$slots.default) {
        if (this.$slots.default[0].elm) {
          container =
            this.$slots.default[0].elm || this.$slots.default[0].elm.innerHTML;
          this.slotInnerHTML = container;
        } else if (this.isPopupOptionsChange) {
          container = this.slotInnerHTML;
        } else if (this.$slots.default[0].context.$children[0].$el) {
          container = this.$slots.default[0].context.$children[0].$el.innerHTML;
        }
      }

      options = {
        ...options,
        Cesium: Cesium,
        callback: {
          onShow: (isShow, popupId) => {
            vm.$emit("change", isShow, popupId);
          },
          onHide: () => {
            vm.$emit("change", false, vm.vueIndex);
            if (vm.destroyOnClose) {
              // 这里其实是无效的，本质上是通过update来实现的
              // vm.unmount();
            }
          },
          onSeparate: payload => {
            vm.$emit("separate", payload);
          }
        }
      };

      let viewer = this.getViewer();

      return new PopupLayer(
        viewer,
        position,
        options,
        container,
        popupWapperStyle,
        popupHeaderStyle,
        popupCloseBtnStyle
      );
    },
    mount() {
      let { viewer, vueKey, vueIndex, vueCesium } = this;
      vueCesium = vueCesium || window.vueCesium;
      viewer = viewer || this.getViewer();
      let popup;

      let find = vueCesium.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      return !viewer.isDestroyed() && popup && popup.show();
    },
    unmount() {
      let { viewer, vueKey, vueIndex, vueCesium } = this;
      viewer = viewer || this.getViewer();
      vueCesium = vueCesium || window.vueCesium;
      let popup;

      let find = vueCesium.PopupManager.findSource(vueKey, vueIndex);
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
      let { vueCesium, vueIndex, vueKey } = this;
      vueCesium = vueCesium || window.vueCesium;
      let popup;
      let find = vueCesium.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }

      if (popup && popup.remove) {
        popup.remove();
        popup = undefined;
        vueCesium.PopupManager.deleteSource(vueKey, vueIndex);
      }
      if (this.visible && this.show) {
        popup = this.createCesiumObject();
        this.$emit("load", { popup: popup });
        if (vueKey && (vueIndex || vueIndex === 0)) {
          vueCesium.PopupManager.addSource(vueKey, vueIndex, popup);
        }
        this.mount();
      }
    },
    removeAll() {
      let popups = window.vueCesium.PopupManager.findAllSource();
      popups.forEach(p => {
        let popup = p.source;
        popup && popup.remove();
      });
    }
  }
};
</script>
