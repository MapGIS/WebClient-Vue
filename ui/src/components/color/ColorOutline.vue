<template>
  <div class="mapgis-ui-color-outline-container">
    <div class="mapgis-ui-color-outline-title">{{ title }}</div>
    <mapgis-ui-sketch-color-picker
        :color.sync="colorCopy"
        @input="$_changeColor"
        :colorStyle="style"
        :showBorder="false"
    />
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-color-outline",
  data() {
    return {
      style: {
        width: "312px",
      },
      colorCopy: "#FF0000"
    }
  },
  props: {
    title: {
      type: String,
      default: "title"
    },
    color: {
      type: String,
      default: "#FF0000"
    },
  },
  watch: {
    color: {
      handler: function () {
        this.colorCopy = this.color;
      }
    }
  },
  created() {
    this.colorCopy = this.color;
  },
  methods: {
    $_changeColor(color){
      this.$emit("changeColor",color);
    }
  }
}
</script>

<style scoped>
.mapgis-ui-color-outline-container {
  width: 342px;
  height: 62px;
  position: relative;
  border: 1px solid rgb(95, 99, 104);
  border-radius: 4px;
  margin: 26px;
  padding: 14px;
}

.mapgis-ui-color-outline-container:hover{
  border-color: #269ff0;
}

.mapgis-ui-color-outline-title {
  position: absolute;
  top: -10px;
  left: 17px;
  z-index: 1;
  padding: 0 10px;
  color: #e8eaed;
  background: rgb(32, 33, 36);
}
</style>