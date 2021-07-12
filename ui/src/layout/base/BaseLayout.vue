<template>
  <mapgis-ui-layout>
    <mapgis-ui-layout>
      <mapgis-ui-layout-header :style="headStyle">
        <slot name="header" />
      </mapgis-ui-layout-header>
      <mapgis-ui-layout-content :style="contentStyle">
        <slot name="content" />
      </mapgis-ui-layout-content>
      <mapgis-ui-layout-footer :style="footerStyle">
        <slot name="footer" />
      </mapgis-ui-layout-footer>
    </mapgis-ui-layout>
    <base-setting />
  </mapgis-ui-layout>
</template>

<script>
import BaseSetting from "./BaseSetting.vue";
export default {
  name: "mapgis-ui-layout-pro",
  components: { BaseSetting },
  props: {
    headStyle: { padding: "0px" },
    contentStyle: { padding: "0px" },
    footerStyle: { padding: "0px" }
  },
  data() {
    return {
      collapsed: false
    };
  },
  methods: {}
};
</script>

<style scoped>
.mapgis-ui-layout-header {
  padding: 0px;
}
.mapgis-ui-layout-content {
  height: calc(100vh - 64px - 24px);
}
</style>
