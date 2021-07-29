<template>
  <div class="mapgis-ui-color-simple-items">
    <div
      v-for="(c, i) in innerColors"
      :class="{
        'mapgis-ui-color-simple-item': true,
        'mapgis-ui-color-simple-item-active': isActive(i)
      }"
      :key="i"
      :style="{ background: getColor(i) }"
      @click="handleColorClick(i)"
    ></div>
  </div>
</template>
<script>
const DefaultColors = [
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
];

export default {
  name: "mapgs-ui-color-simple-picker",
  props: {
    colors: {
      type: Array,
      default: () => DefaultColors
    }
  },
  data() {
    return {
      active: -1,
      innerColors: this.colors || DefaultColors
    };
  },
  watch: {
    innerColors: {
      handle(next) {
        this.innerColors = next;
      },
      deep: true
    }
  },
  methods: {
    isActive(index) {
      return this.active === index;
    },
    getColor(index) {
      let { colors } = this;
      let color = index < colors.length ? colors[index] : "#1890ff";
      return color;
    },
    swapColor(index1, index2) {
      let arr = this.innerColors.map(c => c);
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    handleColorClick(index) {
      this.active = index;
      let color = this.innerColors[index];
      let colors = this.swapColor(0, index);
      // this.innerColors = colors;
      this.$emit("change", { color, colors });
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
.mapgis-ui-color-simple-item-active {
  height: 46px;
  width: 46px;
  border: 3px solid #666666;
}
</style>
