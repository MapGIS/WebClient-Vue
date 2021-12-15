<template>
  <div class="mapgis-ui-color-title-container">
    <div class="mapgis-ui-color-title-title" :style="{paddingLeft: showTitleIcon ? '13px' : '0'}">
      {{ title }}
      <mapgis-ui-title-icon v-show="showTitleIcon"/>
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
    showTitleIcon: {
      type: Boolean,
      default: true
    },
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
  width: 98%;
}

.mapgis-ui-color-title-container:hover{
  border-color: #269ff0;
}

.mapgis-ui-color-title-title {
  font-weight: bolder;
  position: relative;
  padding-left: 13px;
  margin-top: 22px;
  margin-bottom: 14px;
}
</style>