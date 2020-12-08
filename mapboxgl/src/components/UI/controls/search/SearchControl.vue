<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="control" />
  </div>
</template>

<script>
import controlMixin from "../controlMixin";

export default {
  name: "FullscreenControl",
  mixins: [controlMixin],

  props: {
    container: {
      type: HTMLElement,
      default: undefined
    }
  },

  created() {
    this.control = new SearchControl();
    this.$_addControl();
  }
};

class SearchControl {
  constructor(option) {}

  initDom(dom) {}

  bindEvent() {}

  unbindEvent() {}

  handleMouseMove(e) {}

  handleWheel(e) {}

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl";
    this.initDom(this._container);
    this.bindEvent();
    return this._container;
  }

  onRemove() {
    this.unbindEvent();
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
</script>
