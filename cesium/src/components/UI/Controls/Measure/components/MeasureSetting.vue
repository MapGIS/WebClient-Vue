<template>
  <mapgis-ui-row-flex type="vertical" label="线颜色">
    <mapgis-ui-sketch-color-picker-confirm v-model="measureStyle.lineColor" />
  </mapgis-ui-row-flex>
</template>
<script>
export default {
  name: "measure-3d-setting",
  props: {},
  components: {},
  data: vm => ({
    measureStyle: {
      lineColor: ""
    }
  }),
  watch: {
    measureStyle(nStyle) {
      this.emitStyle(nStyle);
    },
    deep: true
  },
  methods: {
    emitStyle(nStyle) {
      this.$emit("measure-style-change", nStyle);
    }
  }
};
</script>
<style lang="less" scoped></style>
