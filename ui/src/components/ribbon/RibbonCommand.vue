<template>
  <div class="mapgis-ui-ribbon-command">
    <mapgis-ui-tooltip :title="description" placement="bottom">
      <div class="mapgis-ui-ribbon-command-icon">
        <mapgis-ui-iconfont :type="icon" class="iconfont" />
      </div>
      <div class="mapgis-ui-ribbon-command-center">
        <span class="mapgis-ui-ribbon-command-span">{{ title }}</span>
      </div>
    </mapgis-ui-tooltip>
  </div>
</template>

<script>
import RibbonOption from "./RibbonOptions";
export default {
  name: "mapgis-ui-ribbon-command",
  props: {
    ...RibbonOption
  },
  created() {},
  methods: {}
};
</script>
