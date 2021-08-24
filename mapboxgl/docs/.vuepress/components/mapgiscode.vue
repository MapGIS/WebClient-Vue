<template>
  <div class="mapgis-code">
    <iframe :src="src" scrolling="auto"></iframe>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "mapgis-code",
  props: {
    src: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
.mapgis-code {
  text-align: center;
  padding-top: 20px;
  & > iframe {
    width: 100%;
    height: 50vh;
    border: none;
    box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}
</style>
