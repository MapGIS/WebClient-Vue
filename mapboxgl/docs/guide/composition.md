# 结构

你可以类似Vue组件的方式使用MapboxGL的特性。 每个组件都可以作为 `<mapgis-web-map>` 组件的子组件。只有 `<mapgis-web-map>` 组件正确加载了，其子组件才会被创建，渲染。

例如，添加地图控制组件

```vue
<template>
<div id="#app">
  <mapgis-web-map
    :accessToken="accessToken"
    :mapStyle.sync="mapStyle"
  >
    <mapgis-navigation-control position="top-right"/>
    <mapgis-geolocate-control position="top-right" />
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

添加popup:

```vue
<template>
  <div id="#app">
    <mapgis-web-map :accessToken="accessToken" :mapStyle.sync="mapStyle">
      <mapgis-navigation-control position="top-right" />
      <mapgis-geolocate-control position="top-right" />
      <mapgis-popup :coordinates="popupCoordinates">
        <span>Hello world!</span>
      </mapgis-popup>
    </mapgis-web-map>
  </div>
</template>

<script>
export default {
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

webclient-vue-mapboxgl的组件照样能在其他的自己写的Vue组件中使用，只要Vue组件在`<mapgis-web-map>`的子组件树下面

例如:

**_Popup 包装类_**:

```vue
<template>
  <div class="popup-wrapper">
    <mapgis-popup :coordinates="popupCoordinates">
      <span>Hello world from wrapped popup!</span>
    </mapgis-popup>
  </div>
</template>

<script>
export default {
  name: 'PopupWrapper'
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
    <mapgis-web-map :accessToken="accessToken" :mapStyle.sync="mapStyle">
      <PopupWrapper />
      <!-- works! -->
    </mapgis-web-map>
  </div>
</template>

<script>
import PopupWrapper from "PopupWrapper"; // wrapper for popup

export default {
  components: {
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
webclient-vue-mapboxgl使用独立的注入机制[provide/inject](https://cn.vuejs.org/v2/api/#provide-inject)

这意味着 所有的在 `<mapgis-web-map>` 结构子树下的组件都能够通过`inject`属性获得： `map`对象, `mapbox`原始对象 and `actions`行为
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
