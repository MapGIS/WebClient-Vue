<template>
  <div class="mapgis-ui-icon-wrapper">
    <i v-if="isSvg" class="icon" v-html="icon"> </i>
    <img v-else :src="icon" fit="contain" />
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-icon",
  props: ["icon"],
  computed: {
    isSvg() {
      if (this.icon && this.icon.indexOf("<svg") >= 0) {
        return true;
      }

      return false;
    }
  }
};
</script>
