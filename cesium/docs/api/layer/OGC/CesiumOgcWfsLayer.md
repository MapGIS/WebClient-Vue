# OGC WFS

> mapgis-3d-ogc-wfs-layer

## 属性

### `baseUrl`

- **类型:** `String`
- **必传**
- **非侦听属性**
- **描述:** 服务基地址
- **示例:** <br/>
  > 请求 igs 时： <br/> > http://{ip}:{port}/igs/rest/services/Map/{mapName}/WFSServer <br/>

### `options`

- **类型:** `Object`
- **必传**
- **侦听属性**
- **描述:** Cesium 的进阶参数，另外不属于 cesium 的如下参数也在 options 中：
  > vueKey String 默认值 default 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持 <br/>
  > vueIndex String 默认值(Math.random() \* 100000000).toFixed(0) 该 key 的主要作用市用来记录 Cesium 的 Source,primitive, entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持
- **参考:** <br>
  `Cesium的WFS参数` in [WfsProvider](http://webclient.smaryun.com/static/modules/cesium/api/cesium/WfsProvider.html?classFilter=wfs)

### `wfsVersion`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** WFS 标准版本，可选 1.0.0 1.1.0 2.0.0：
  > 默认值为“2.0.0” <br/>

### `count`

- **类型:** `Number`
- **可选**
- **侦听属性**
- **描述:** 请求要素的条数，默认值 1000，WFS2.0.0 支持

### `autoReset`

- **类型:** `Boolean`
- **可选**
- **侦听属性**
- **描述:** 视角是否自动切换到地图文档范围或第一个 gdbp 图层范围

### `renderer`

- **类型:** `Object`
- **必传**
- **侦听属性**
- **描述:** 渲染器，专题图渲染规则，该属性用于提供专题服务
  > renderer 参数提供默认值
- **参考:** <br>
  `WFS的renderer参数` in [appendFeatureLayer](http://192.168.82.89:8086/static/modules/cesium/api/cesium/Layers.html?classFilter=layers)

### `type`

- **类型:** `String`
- **必传**
- **侦听属性**
- **描述:** renderer 参数，专题图类型，可选 "simple"|"unique-value"|"class-breaks"
  > 默认类型为"simple" <br/>

### `symbol`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 统一专题图符号样式，包含 type|symbolLayers 属性

### `type`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 专题图符号样式类型，可选 "point-3d"|"line-3d"|"polygon-3d"
  > 默认为"polygon-3d"类型 <br/>

### `symbolLayers`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 专题图符号图层，包含了 type|material|outline|height|size 属性

### `type`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 专题图符号图层类型，可选 "icon"|"line"|"fill"|"extrude"
  > 默认值为“fill” <br/>

### `material`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 填充材料，其包含的 color 属性比较重要，决定了专题图符号图层的填充颜色
  > color 属性默认值为“#72A84D”，可更改 <br/>

### `outline`

- **类型:** `Object`
- **可选**
- **侦听属性**
- **描述:** 符号图层外边框样式，包含了 color|width 属性
  > color 属性：边框线颜色，当传入边框线颜色或边框线宽度参数时启用边框线； <br/>
  > width 属性：边框线宽度，当传入边框线颜色或边框线宽度参数时启用边框线。 <br/>

### `label`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 统一专题图标签

### `id`

- **类型:** `String`
- **可选**
- **侦听属性**
- **描述:** 图层唯一标识符，如果不传，以 vueIndex 代替

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件， <br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `token`

- **类型:** `Object`
- **可选**
- **非侦听属性**
- **描述:** token 信息
  > 要传 token 时，请以如下方式传递 <br/>
  > token:{ <br/>
  > key: "token", <br/>
  > value: "9c157e9585486c02edf817d2ecbc7752" <br/>
  > }

## 事件

All common layer [events](/zh/api/Layers/#events)

### `@load`

- **描述:** 图层加载完成事件
- **返回值** `{ layer,vue }` <br>
  `layer` 图层对象 <br>
  `vue` vue 对象 <br>

### `@unload`

- **描述:** 图层注销事件
- **返回值** `{ vue }` <br>
  `vue` vue 对象 <br>

## 示例

### 加载 WFS 地图 - IGS - 4326

::: demo

```vue
<template>
  <mapgis-3d-web-scene @load="handleLoad">
    <mapgis-3d-ogc-wfs-layer
      :baseUrl="baseUrl"
      :wfsVersion="wfsVersion"
      :autoReset="autoReset"
      :count="count"
      :renderer="renderer"
    />
  </mapgis-3d-web-scene>
</template>

<script>
export default {
  data() {
    return {
      //服务基地址
      baseUrl:
        "http://webclient.smaryun.com:8089/igs/rest/services/Map/Hubei4326/WFSServer",
      //wfs版本
      wfsVersion: "2.0.0",
      //自动跳转至图层范围
      autoReset: true,
      //请求要素的条数,默认值1000,wfs2.0.0支持
      count: 1000,
      //渲染器
      renderer: {
        //类型为simple，以简单符号渲染
        type: "simple",
        //符号类型
        symbol: {
          type: "polygon-3d",
          symbolLayers: {
            //选择填充类型
            type: "fill",
            //填充材料
            material: {
              color: "#72A84D",
            },
            //外边线样式
            outline: {
              color: "#727F8B",
              width: 2.0,
            },
            height: 1000,
            size: 20,
          },
        },
        label: "标签",
      },
    };
  },
};
</script>

<style lang="css">
.main {
  height: 600px;
  width: 100%;
}
</style>
```

:::
