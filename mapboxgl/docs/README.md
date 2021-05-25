---
home: true
heroImage: /logo.svg
actionText: Get Started →
actionLink: /guide/
features:
  - title: Declarative style
    details: You can use map elements like layers, markers, popups as Vue components and control them via synchronized props
  - title: Vuefied
    details: Map elements declared as components respect Vue lifecycle, emit map events like Vue events and can be used in OOP-style

  - title: Promisified async actions
    details: You can do async map operations and get results in Promise without messing with map events and figuring out what action cause it
footer: © 2020 云生态圈, all rights reserved.<a href="http://www.beian.miit.gov.cn/" target="_blank">ICP证：鄂B2-20190047</a><a><img src="http://oss-smaryun-new.oss-cn-beijing.aliyuncs.com/images/police_icon.png" style="height:18px;">鄂公网安备 42018502000503号</a><a href="http://wljg.scjgj.wuhan.gov.cn:80/whwjww/indexquery/indexqueryAction!dizviewjk.dhtml?webId=2ec48b653aa55ca194b9df62cc4e45fe" target="_blank"><img src="http://oss-smaryun-new.oss-cn-beijing.aliyuncs.com/images/govIcon.gif" style="height:20px;" title="武汉网监电子标识">工商电子标识</a>
---

If you like long story, check out [blog post](https://soal.red/reasoning-behind-vue-mapbox/)

```javascript
// main.js
import Mapgis2d from "@mapgis/webclient-vue-mapboxgl";
Vue.use(Mapgis2d);
```

```vue
<template>
  <mapgis-web-map
    container="map-test"
    :center.sync="center"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
  >
    <mapgis-marker :coordinates.sync="markerCoordinates" color="green" />
    <mapgis-geojson-layer
      type="fill"
      :sourceId="sourceId"
      :layerId="layerId"
      :source="geojson"
      @click="handleClick"
    />
  </mapgis-web-map>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      accessToken: 'some_token',
      mapStyle: 'mapbox://map_style',
      geojson: { /* … some geojson */}
      layerId: 'firstLayer',
      sourceId: 'firstSource',
      markerCoordinates='[50, 50]'
    }
  }
}
</script>
```

::: tip Dependencies
[Vue.js 2.5+](https://github.com/vuejs/vue)  
[Mapbox GL JS 1.9.2+](https://github.com/mapbox/mapbox-gl-js)  
[map-promisified](https://github.com/soal/map-promisified)
:::

::: tip Size
~ 15 kB minified and gzipped
:::

::: warning Browser compatibility
_Coming soon_
:::
