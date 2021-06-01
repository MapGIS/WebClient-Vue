# GeoJSON
> mapgis-3d-geojson-datasource
## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:** 
```
mapgis-web-scene组件的ID，当使用多个mapgis-web-scene组件时，需要指定该值，来唯一标识mapgis-web-scene组件，
同时mapgis-web-scene插槽中的组件也需要传入相同的vueKey，让组件知道应该作用于哪一个mapgis-web-scene。
```

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:** 
```
当mapgis-web-scene插槽中使用了多个相同组件时，例如多个mapgis-3d-igs-doc-layer组件，用来区分组件的标识符。
```

### `url`

- **类型**: `Object`
- **必传**
- **侦听属性** 非-watch 属性
- - **描述** GeoJSON 对象或者 Url
    1. url geojson 的 url 地址，注意：Cesium 的 GeoJSON 格式`只支持`EPSG：4326，Crs 是其他类型的情况都不支持,如 4490、4610、3857 等
    2. geojson 对象，注意：Cesium 的 GeoJSON 格式`只支持`EPSG：4326，Crs 是其他类型的情况都不支持,如 4490、4610、3857 等

### `options`

- **类型**: `Object`
- **非侦听属性** 非 watch 属性
- **默认值**
  ```js
  {
      sourceUri: undefined,  // 重定向uri地址
      markerSize: 48,
      markerSymbol: undefined,
      markerColor: Cesium.Color.ROYALBLUE,  // Cesium.Color.ROYALBLUE;
      stroke: Cesium.Color.YELLOW, // Cesium.Color.YELLOW;
      strokeWidth: 2,
      fill: Cesium.Color.fromBytes(255, 255, 0, 100), // Cesium.Color.fromBytes(255, 255, 0, 100);
      clampToGround: true,  //贴合地形和倾斜
  }
  ```
- - **描述** 额外参数
- **查看** [GeoJsonDataSource](https://cesium.com/docs/cesiumjs-ref-doc/GeoJsonDataSource.html#.LoadOptions)

## 事件

### `@load`

- **描述** 在 Geojson 加载完毕后发送该事件
- **Payload** `{ component }`
- - `component` Vue 组件对象

### `@unload`

- **描述** 在 Geojson 卸载完毕后发送该事件
- **Payload** `{ component }`
- - `component` Vue 组件对象
