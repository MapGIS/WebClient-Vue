# 结构

你可以类似Vue组建的方式使用MapboxGL的特性。 每个组件都可以作为 `<mapbox-map>` 组件的子组件。只有 `<mapbox-map>` 组件正确加载了，其子组件才会被创建，渲染。

例如，添加地图控制组件

```vue
<template>
<div id="#app">
  <mapbox-map
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
  >
    <mapbox-navigation-control position="top-right"/>
    <mapbox-geolocate-control position="top-right" />
  </mapbox-map>
</div>
</template>

<script>
import { MapboxMap, MapboxNavigationControl, MapboxGeolocateControl } 
from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxNavigationControl,
    MapboxGeolocateControl
  },
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "style_object"
    };
  }
};
</script>
```

添加popup:

```vue
<template>
  <div id="#app">
    <mapbox-map :accessToken="accessToken" :mapStyle.sync="mapStyle">
      <mapbox-navigation-control position="top-right" />
      <mapbox-geolocate-control position="top-right" />
      <mapbox-popup :coordinates="popupCoordinates">
        <span>Hello world!</span>
      </mapbox-popup>
    </mapbox-map>
  </div>
</template>

<script>
import {
    MapboxMap,
    MapboxNavigationControl,
    MapboxGeolocateControl
    MapboxPopup
} from "@mapgis/webclient-vue-mapboxgl";

export default {
  components: {
    MapboxMap,
    MapboxNavigationControl,
    MapboxGeolocateControl
    MapboxPopup
  },
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "style_object",
      popupCoordinates: [10, 10]
    };
  }
};
</script>
```

webclient-vue-mapboxgl的组件照样能再其他的自己写的Vue组件中使用，只要Vue组件在`<mapbox-map>`的子组件树下面

例如:

**_Popup 包装类_**:

```vue
<template>
  <div class="popup-wrapper">
    <mapbox-popup :coordinates="popupCoordinates">
      <span>Hello world from wrapped popup!</span>
    </mapbox-popup>
  </div>
</template>

<script>
import { MapboxPopup } from '@mapgis/webclient-vue-mapboxgl';

export default {
  name: 'PopupWrapper'
  components: {
    MapboxPopup
  },
  computed() {
    popupCoordinates() {
      // Here we can do some work for calculate proper coordinates
      //...
      return [10, 10]
    }
  }
}
</script>
```

**_主组件_**:

```vue
<template>
  <div id="#app">
    <mapbox-map :accessToken="accessToken" :mapStyle.sync="mapStyle">
      <PopupWrapper />
      <!-- works! -->
    </mapbox-map>
  </div>
</template>

<script>
import { MapboxMap } from "@mapgis/webclient-vue-mapboxgl";
import PopupWrapper from "PopupWrapper"; // wrapper for popup

export default {
  components: {
    MapboxMap,
    PopupWrapper // wrapper for popup
  },
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "style_object"
    };
  }
};
</script>
```

::: tip
weblient-vue-mapboxgl使用独立的注入机制[provide/inject](https://cn.vuejs.org/v2/api/#provide-inject)

这意味着 所有的在 `<mapbox-map>` 结构子树下的组件都能够通过`inject`属性获得： `map`对象, `mapbox`原始对象 and `actions`行为
:::

成功挂载后，所有组件都会发送 `added` 事件， 每个事件的回调payload类似下面结构。 
``` json
{
  //标准 payload
  map: mapboxgl.Map,
  component: this.component,
  data: {}  
}

{
  //弹出框 payload
  popup: this.popup
}

{
  //图层 payload
  layerId: this.layerId
}
```
