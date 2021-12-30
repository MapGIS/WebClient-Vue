<template>
  <mapgis-ui-row class="mapgis-ui-color-picker-left">
    <div class="mapgis-ui-color-picker-left-title">{{ title }}</div>
    <div class="mapgis-ui-color-picker-left-color">
      <mapgis-ui-sketch-color-picker
        :color="valueCopy"
        @input="$_changeColorSketch"
      />
    </div>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-color-picker-left",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: String
    },
  },
  data() {
    return {
      valueCopy: undefined
    }
  },
  watch: {
    value: {
      handler: function () {
        this.valueCopy = this.value;
      },
      deep: true
    }
  },
  methods: {
    $_changeColorSketch(e) {
      let rgba = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      this.$emit("change", rgba);
    },
  },
  mounted() {
    this.valueCopy = this.value;
  }
}
</script>

<style scoped>
.mapgis-ui-color-picker-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin: 10px 0;
}

.mapgis-ui-color-picker-left-title, .mapgis-ui-color-picker-left-color {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-color-picker-left-title {
  width: 70px;
  text-align: left;
  padding-left: 10px;
  font-size: 12px;
  font-weight: bolder;
}

.mapgis-ui-color-picker-left-color {
  padding-right: 10px;
  width: calc(100% - 70px);
}
</style>