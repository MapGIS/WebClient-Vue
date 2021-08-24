# 结构

## 默认布局 Layout-Pro

``` vue
<template>
  <mapgis-ui-layout-pro>
    <template slot="header" class="mapgis-pro-header">
      <custom-header />
    </template>
    <template slot="content" class="mapgis-pro-centent">
      <custom-content />
    </template>
    <template slot="footer" class="mapgis-pro-footer">
      <custom-footer />
    </template>
  </mapgis-ui-layout-pro>
</template>

<script>
import CustomHeader from "./Header.vue";
import CustomSider from "./Sider.vue";
import CustomContent from "./Content.vue";
import CustomFooter from "./Footer.vue";

export default {
  name: "custom-layout",
  components: {
    CustomHeader,
    CustomSider,
    CustomContent,
    CustomFooter,
  },
  mounted() {},
};
</script>
```