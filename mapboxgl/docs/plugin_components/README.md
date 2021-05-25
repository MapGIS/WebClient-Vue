# 插件组件

本框架实现了mapboxgl.js的内核包装。
其他的三方插件功能，类似[Mapbox Gl JS plugins](https://docs.mapbox.com/mapbox-gl-js/plugins/)没有被封装。但是这些三方的插件也可以被封装成Vue组件的形式。

## 使用插件组件

使用插件组件相当简单。只需要和正常的组件一样放到`<mapbox-map>`的内部并传递必要的属性就可以使用了。
以地名编码为例[VueMapbox Geocoder](https://github.com/soal/vue-mapbox-geocoder).

```vue
<template>
  <mapbox-map :accessToken="accessToken" :mapStyle="mapStyle">
    <mapbox-geocoder-control
      :accessToken="accessToken"
      :input.sync="defaultInput"
      @results="handleSearch"
    />
  </mapbox-map>
</template>

<script>
import { MapboxMap } from "@mapgis/webclient-vue-mapboxgl";
import MapboxGeocoderControl from "vue-mapbox-geocoder";

export default {
  name: "App",

  components: {
    MapboxMap,
    MapboxGeocoderControl
  },
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "some_style",
      defaultInput: "Bodhgaya"
    };
  },
  methods: {
    handleSearch(event) {
      console.log(event);
    }
  }
};
</script>
```

如果中地&开源届封装的组件还是满足不了项目需求，那么下一章自己封装一个组件，相当简单[自定义封装组件](/zh/plugin_components/plugin_components_development.md).

## 目前开源组件

- [VueMapbox Geocoder](https://github.com/soal/vue-mapbox-geocoder)

## 目前中地内置组件

- [mapv](https://github.com/soal/vue-mapbox-geocoder)
- [echarts](https://github.com/soal/vue-mapbox-geocoder)
- [deckgl](https://github.com/soal/vue-mapbox-geocoder)
- [客户端专题图](https://github.com/soal/vue-mapbox-geocoder)

