# 图层和数据源

## 添加图层

Mapbox绘制要素的方式都是通过层的方式实现绘制的，不同的层给不同的样式。
图层使用`source`对象来指定对应的数据源（source类型可以可以是geojson，栅格瓦片，矢量瓦片）。数据源必须先指定给地图，然后图层才能指定对应的`source`对象并根据不同的source来做不同的图层表达。

> 此外，图层最关键的是其他的属性，如layout,paint,filter来区分不同的图层并绘制不同的样式。

::: tip
在我们行业， 最关键的是掌握 `filter`属性的类AST语法 以及 `paint` 的专题图模板用法 ,如下所示:

``` js
case1 = ["<=", ["get", "某个字段名"], 0]
case2 = ["<=", ["get", "某个字段名"], 100]
case3 = ["<=", ["get", "某个字段名"], 200]
paint:{
"xxx-color": 
  [
    "case",
    case1,
    '#ff0000',
    case2,
    '#00ff00',
    case3,
    '#0000ff',
    '#ffffff'
  ]
}
::: 

[sources](https://docs.mapbox.com/mapbox-gl-js/api/#sources) 和 [layers](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers).

@mapgis/webclient-vue-mapboxgl 把图层作为 Vue组件进行处理

`source` 和 `layer` 通过props传递参数. 不同类型的图层的数据源类型也不一样.

例如：使用geojson格式的数据源当做数据源处理。

```vue
<template>
  <mapbox-map :accessToken="accessToken" :mapStyle.sync="mapStyle">
    <!-- 导航控件 -->
    <mapbox-navigation-control position="top-right" />
    <!-- GeoJSON图层 -->
    <mapbox-geojson-layer
      :sourceId="geoJsonSource.id"
      :source="geoJsonSource"
      layerId="myLayer"
      :layer="geoJsonlayer"
    />
  </mapbox-map>
</template>

<script>
import { MapboxMap, MapboxNavigationControl, MapboxGeojsonLayer } from "vue-mapbox";

export default {
  components: {
    MapboxMap,
    MapboxNavigationControl,
    MapboxGeojsonLayer
  },
  data() {
    return {
      accessToken: "some_token",
      mapStyle: "style_object",
      geoJsonSource: {
        //... GeoJSON 对象或者url地址
      },
      geoJsonLayer: {
        //...GeoJSON 图层的配色样式等配置
      }
    };
  }
};
</script>
```

> 上面的例子中 `geoJsonSource` 可以是一个对象 `object`, 也可以是一个返回GeoJSON格式数据的网络请求： URL`string`地址

数据源source通过对象形象存储到`Map`中，并以 `sourceId` 关键字记录。如果确定source已经添加到地图中，直接通过`sourceId`就可以定制不同的图层了。

如果尝试重复添加2次相同的数据源`id`,整个框架只会使用已经存在的当前`source`。但是你可以通过设置 `replaceSource` 参数为 `true` 来替换老的`source`，这样props传入的`source`就可以替换老的`source`了。

::: warning
默认情况下，当图层销毁的时候，对应的`source`也会从地图中移除，如果你想保留当前`source`（如以后使用或者其他图层仍在使用），设置`clearSource` 属性为 `false`.
:::

## 响应式编程

图层组件实时观察响应 `layer`属性的变化并同步更新地图显示上。  例如, 如果你改变了`filter` 属性 GeojsonLayer, 其过滤规则会自动的应用并显示到对应的地图上. 不是所有的属性都支持动态变化, 目前支持的响应式属性有 `minzoom`, `maxzoom`, `paint`, `layout`, `filter`.

::: tip
实际操作中使用最多的往往是  `layout`, `filter`
:::

## 图层获取

GeoJSON 和 Vector 图层能够获取当前渲染的要素集合: 
1. `.getRenderedFeatures(filter?)`
1. `.getSourceFeatures(geometry?, filter?)` 
1. `.getFeatureState(featureId)`. 

上面的方法和mapbox官方的方式是类似的，请看官方的 [queryRenderedFeatures()](https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures) 以及 [querySourceFeatures()](https://docs.mapbox.com/mapbox-gl-js/api/#map#querysourcefeatures) ,唯一不同的是，我们封装的方法是返回当前图层的要素，官方的返回所有图层的要素。

> 其实就是我们分类分图层查询，  官方是统一查询，自己根据业务处理结果

## 图层方法

图层组件拥有方法 `move()` 以及 `remove()`.

move() : 移动一个图层到不同的z-positon位置。

remove() : 对应的地图事件 会 销毁当前图层组件以及地图移除对应的图层layer和数据源source，如果该图层设置了`clearSource: false`属性,则只移除layer不删除source。

## 图层事件

当数据加载或者用户交互 `点击click` 都会触发 `图层会发送事件`. 全部事件请看 [API section](/zh/api/Layers/README.md#events)

## 接口变更

0.1老版本的开源的封装是 source, layer分开处理，使用是嵌套使用.
``` vue
<template>
  <source>
    <layer><layer/>
  </source>
</template>
```
当前版本将source作为一个属性传递给layer

[sources](https://docs.mapbox.com/mapbox-gl-js/api/#sources) 以及 [layers](https://docs.mapbox.com/mapbox-gl-js/style-spec/#layers) in Mapbox GL JS 官方文档.
