# 地图控制视图

## 概述

控制视图是 UI 组件来控制地图状态如缩放比例和方向。

MapboxGl 官方的 [UI 文档](https://www.mapbox.cn/mapbox-gl-js/api/#user%20interface)

在 webclient-vue-mapboxgl 中，这些 UI 被封装成 Vue 的组件形式，这样你可以通过传递 props 的方式动态控制组件的属性和行为。

**_所有控制视图_** :

```vue
<template>
  <div id="#app">
    <mapgis-web-map
      :accessToken="accessToken"
      :mapStyle.sync="mapStyle"
      :attributionControl="false"
    >
      <mapgis-attribution-control />
      <mapgis-navigation-control position="top-right" />
      <mapgis-geolocate-control position="top-right" />
      <mapgis-navigation-control position="top-right" />
      <mapgis-geolocate-control position="top-right" />
      <mapgis-scale-control />
    </mapgis-web-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "style_object"
    };
  }
};
</script>
```

控制视图的属性请看[API docs](/api/controls.md).

### 归属控制视图

该视图是地图左下角的官方标识，如果使用 mapbox 的地图会出现 mapbox 的标志，使用 mapgis 的地图会出现 mapgis 的标志。

根据 Mapbox 默认的策略[详细英文](https://docs.mapbox.com/help/how-attribution-works/) [简版中文](https://www.mapbox.cn/mapgis-gl-js/api/#attributioncontrol)归属控制视图默认是激活的，你可以通过下面代码取消这个归属：核心是传递`attributionControl` 为 `false`

```js
var map = new mapboxgl.Map({ attributionControl: false });
// 使用自己的归属控制视图
map.addControl(new mapboxgl.AttributionControl({ compact: true }));
```
