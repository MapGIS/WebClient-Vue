# 地图场景 mapgis-3d-geojson-datasource

## 属性

### `vueKey`

- **Type**: `String`
- **non-synced** 非 watch 属性
- **Default:** `default`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `vueIndex`

- **Type**: `[String, Number]`
- **non-synced** 非 watch 属性
- **Default:** `cesium-${("" + Math.random()).split(".")[1]}`
- - **Description:** 该 key 的主要作用市用来记录 Cesium 的 Source,primitive,entity 的内存中的引用数组的引用，从而避免 vue 对 cesium 的内存劫持

### `url`

- **Type**: `Object`
- **Required**
- **synced** 非-watch 属性
- - **Description:** GeoJSON 对象或者 Url
    1. url geojson 的 url 地址，注意：Cesium 的 GeoJSON 格式`只支持`EPSG：4326，Crs 是其他类型的情况都不支持,如 4490、4610、3857 等
    2. geojson 对象，注意：Cesium 的 GeoJSON 格式`只支持`EPSG：4326，Crs 是其他类型的情况都不支持,如 4490、4610、3857 等

### `options`

- **Type**: `Object`
- **non-synced** 非 watch 属性
- **Default:**
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
- - **Description:** 额外参数
- **see** [GeoJsonDataSource](https://cesium.com/docs/cesiumjs-ref-doc/GeoJsonDataSource.html#.LoadOptions)

## 事件

### `@load`

- **Description:** 在 Geojson 加载完毕后发送该事件
- **Payload** `{ component }`
- - `component` Vue 组件对象

### `@unload`

- **Description:** 在 Geojson 卸载完毕后发送该事件
- **Payload** `{ component }`
- - `component` Vue 组件对象
