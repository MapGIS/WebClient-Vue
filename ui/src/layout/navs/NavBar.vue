<template>
  <div>
    <div class="mapgis-ui-nav-bar">
      <slot />
    </div>
    <div class="mapgis-ui-nav-bar-reverse">
      <slot name="reverse" />
    </div>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-nav-bar",
  props: {
    collapsed: { type: Boolean, default: false },
    detached: { type: Boolean, default: false },
    position: {
      type: String,
      default: "start" // start end
    }
  },
  mounted() {
    this.$on("change-bar", this.handleValue); // 在mounted生命周期注册事件
  },
  methods: {
    handleValue(value) {
      this.$parent.$emit("change-bar", value);
      this.changeSelect(value);
    },
    changeSelect(select) {
      this.$slots.default.forEach(s => {
        let value = s.componentOptions.propsData.value;
        let elm = s.elm;
        let className = "mapgis-ui-nav-bar-item-selected";
        if (value == select) {
          elm.className += ` ${className}`;
        } else {
          elm.className = elm.className.replace(
            new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"),
            " "
          );
        }
      });
      this.$slots.reverse.forEach(s => {
        let value = s.componentOptions.propsData.value;
        let elm = s.elm;
        let className = "mapgis-ui-nav-bar-item-selected";
        if (value == select) {
          elm.className += ` ${className}`;
        } else {
          elm.className = elm.className.replace(
            new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"),
            " "
          );
        }
      });
    }
  }
};
</script>
