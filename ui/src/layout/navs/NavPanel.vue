<template>
  <div class="mapgis-ui-nav-panel">
    <div class="action-bar">
      <slot name="action-bar" />
    </div>

    <slot />

    <div class="action-bar-reverse">
      <slot name="action-bar-reverse" />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-nav-panel",
  model: {
    prop: "activeKey",
    event: "change-active"
  },
  props: {
    activeKey: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active: this.activeKey
    };
  },
  mounted() {
    this.$on("change-bar", this.handleValue);
    this.updateDisplay();
  },
  methods: {
    handleValue(value) {
      const vm = this;
      this.active = this.active == value ? "" : value;
      this.$emit("change-active", this.active);
      this.$slots.default.forEach(children => {
        let attrs = children.data.attrs;
        if (attrs && attrs.value) {
          if (attrs.value == vm.active) {
            children.elm.style.display = "block";
          } else {
            children.elm.style.display = "none";
          }
        }
      });
    },
    updateDisplay(value) {
      value = value || this.activeKey;
      this.$slots.default.forEach(children => {
        let attrs = children.data.attrs;
        if (attrs && attrs.value) {
          if (attrs.value == value) {
            children.elm.style.display = "block";
          } else {
            children.elm.style.display = "none";
          }
        }
      });
    }
  }
};
</script>
