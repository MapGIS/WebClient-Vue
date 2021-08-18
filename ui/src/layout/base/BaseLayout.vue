<template>
  <mapgis-ui-layout>
    <mapgis-ui-layout>
      <mapgis-ui-layout-header class="mapgis-ui-pro-layout-header">
        <slot name="header" />
        <mapgis-ui-div class="mapgis-ui-pro-layout-ribbon">
          <slot name="ribbon" />
        </mapgis-ui-div>
      </mapgis-ui-layout-header>
      <mapgis-ui-layout>
        <mapgis-ui-layout-sider
          :width="leftSiderWidth"
          :collapsible="false"
          class="mapgis-ui-pro-layout-leftsider"
        >
          <slot name="leftsider" />
        </mapgis-ui-layout-sider>
        <mapgis-ui-layout-content class="mapgis-ui-pro-layout-content">
          <div class="mapgis-ui-pro-layout-content-left">
            <slot name="content-left" />
          </div>
          <div class="mapgis-ui-pro-layout-content-center">
            <slot name="content-center" />
          </div>
          <div class="mapgis-ui-pro-layout-content-right">
            <slot name="content-right" />
          </div>
        </mapgis-ui-layout-content>
      </mapgis-ui-layout>
      <mapgis-ui-layout-footer class="mapgis-ui-pro-layout-footer">
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
    leftSiderWidth: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      collapsed: false
    };
  },
  methods: {}
};
</script>
