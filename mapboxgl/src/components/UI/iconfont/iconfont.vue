<template>
  <svg v-if="iconId" class="mapgis-iconfont" aria-hidden="true" @click="click()">
    <use :xlink:href="iconId"></use>
  </svg>
</template>

<script>
import "./iconfont"; // 移动到public的asset目录下
export default {
  name: "mapgis-iconfont",
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  computed: {
    iconId() {
      return this.type ? `#${this.type}` : "";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
};
</script>
<style>
.mapgis-iconfont {
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25em;
  overflow: hidden;
}
</style>
