<template>
  <div class="mapgis-ui-color-title-container">
    <div class="mapgis-ui-color-title-title">
      {{ title }}
      <mapgis-ui-title-icon/>
    </div>
    <mapgis-ui-sketch-color-picker
        :color.sync="colorCopy"
        @input="$_changeColor"
    />
  </div>
</template>

<script>

export default {
  name: "mapgis-ui-color-title",
  data() {
    return {
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
.mapgis-ui-color-title-container {
  width: 99%;
}

.mapgis-ui-color-title-container:hover{
  border-color: #269ff0;
}

.mapgis-ui-color-title-title {
  position: relative;
  padding-left: 13px;
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>