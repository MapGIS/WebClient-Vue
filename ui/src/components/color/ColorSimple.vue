<template>
  <div class="mapgis-ui-color-simple-items">
    <div
      v-for="(c, i) in colors"
      class="mapgis-ui-color-simple-item"
      :key="i"
      :style="{ background: getColor(i) }"
    ></div>
  </div>
</template>
<script>
export default {
  name: "mapgs-ui-color-simple-picker",
  props: {
    colors: {
      type: Array,
      default: () => [
        "#f5222d",
        "#fa541c",
        "#fa8c16",
        "#faad14",
        "#fadb14",
        "#a0d911",
        "#52c41a",
        "#13c2c2",
        "#1890ff",
        "#2f54eb",
        "#722ed1",
        "#eb2f96"
      ]
    }
  },
  methods: {
    getColor(index) {
      let { colors } = this;
      let color = index < colors.length ? colors[index] : "#1890ff";
      console.log("color", color);
      return color;
    }
  }
};
</script>

<style scoped>
.mapgis-ui-color-simple-items {
  width: 100%;
  height: auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}
.mapgis-ui-color-simple-item {
  height: 40px;
  width: 40px;
  margin: 3px;
  border-radius: 4px;
}
</style>
