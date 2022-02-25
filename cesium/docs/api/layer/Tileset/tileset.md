# 3D Tiles 图层

> mapgis-3d-3dtiles-layer
> [点此跳转到示例](#example)

## 属性

### `vueKey`

- **类型:** `String`
- **可选**
- **非侦听属性**
- **默认值:** `default`
- **描述:**
  > mapgis-web-scene 组件的 ID，当使用多个 mapgis-web-scene 组件时，需要指定该值，来唯一标识 mapgis-web-scene 组件，<br/>
  > 同时 mapgis-web-scene 插槽中的组件也需要传入相同的 vueKey，让组件知道应该作用于哪一个 mapgis-web-scene。

### `vueIndex`

- **类型:** `Number`
- **可选**
- **非侦听属性**
- **描述:**
  > 当 mapgis-web-scene 插槽中使用了多个相同组件时，例如多个 mapgis-3d-igs-doc-layer 组件，用来区分组件的标识符。

### `url`

- **类型**: `Object`
- **必传**
- **非侦听属性** 非-watch 属性
- **描述** M3D 的 IGServer 的服务地址 Url

### `show`

- **类型**: `Boolean`
- **侦听属性** watch 属性
- **默认值** `true`
- **描述** 是否显示

### `offset`

- **类型**: `Object`
- **非侦听属性** 非 watch 属性
- **默认值** `{ longitude: 0, latitude: 0, height: 0 }`
- **描述** 模型的偏移方向，主要用来抬高/降低模型

```json
{
  "longitude": 0,
  "latitude": 0,
  "height": 0
}
```

### `scale`

- **类型**: `Object`
- **非侦听属性** 非 watch 属性
- **默认值** `{ x: 1.0, y: 1.0, z: 1.0 }`
- **描述** 模型的缩放比例，用来缩放模型

```json
{
  "x": 1.0,
  "y": 1.0,
  "z": 1.0
}
```

### `opacity`

- **类型**: `Number`
- **非侦听属性** 非 watch 属性
- **描述** 模型的透明度，内部通过 Cesium3DTileStyle 实现，`不推荐使用`

### `autoReset`

- **类型**: `Boolean`
- **非侦听属性** 非-watch 属性
- **默认值** `true`
- **描述** 加载完毕后是否飞到对应的范围

### `maximumScreenSpaceError`

- **类型**: `Number`
- **非侦听属性** 非-watch 属性
- **默认值** `16`
- **描述** 这个最大屏幕几何异常 [英文原文](https://prismic-io.s3.amazonaws.com/cesium/5f705923-8ff1-410e-990a-0018157e8086_3d-tiles-overview.pdf)， [中文链接](https://www.cnblogs.com/onsummer/p/13357226.html)
- ![几何异常](../m3d/image/maximumScreenSpaceError.png)

### `maximumMemoryUsage`

- **类型**: `Number`
- **非侦听属性** 非-watch 属性
- **默认值** `512`
- **描述** 最大内存使用

### 其他 3d-tileset 通用属性

| 名称                                      | 类型    | 默认值  |
| :---------------------------------------- | :------ | :------ |
| cullWithChildrenBounds                    | Boolean | true    |
| cullRequestsWhileMoving                   | Boolean | true    |
| cullRequestsWhileMovingMultiplier         | Number  | 60.0    |
| preloadWhenHidden                         | Boolean | false   |
| preloadFlightDestinations                 | Boolean | true    |
| preferLeaves                              | Boolean | false   |
| dynamicScreenSpaceError                   | Boolean | false   |
| dynamicScreenSpaceErrorDensity            | Number  | 0.00278 |
| dynamicScreenSpaceErrorFactor             | Number  | 4.0     |
| dynamicScreenSpaceErrorHeightFalloff      | Number  | 0.25    |
| progressiveResolutionHeightFraction       | Number  | 0.3     |
| foveatedScreenSpaceError                  | Boolean | true    |
| foveatedConeSize                          | Number  | 0.1     |
| foveatedMinimumScreenSpaceErrorRelaxation | Number  | 0.0     |
| foveatedTimeDelay                         | Number  | 0.2     |
| skipLevelOfDetail                         | Boolean | false   |
| baseScreenSpaceError                      | Number  | 1024    |
| skipScreenSpaceErrorFactor                | Number  | 16      |
| skipLevels                                | Number  | 1       |
| immediatelyLoadDesiredLevelOfDetail       | Boolean | false   |
| loadSiblings                              | Boolean | false   |
| luminanceAtZenith                         | Number  | 0.2     |
| specularEnvironmentMaps                   | String  | ""      |
| debugHeatmapTilePropertyName              | String  | ""      |
| debugFreezeFrame                          | Boolean | false   |
| debugColorizeTiles                        | Boolean | false   |
| debugWireframe                            | Boolean | false   |
| debugShowBoundingVolume                   | Boolean | false   |
| debugShowContentBoundingVolume            | Boolean | false   |
| debugShowViewerRequestVolume              | Boolean | false   |
| debugShowGeometricError                   | Boolean | false   |
| debugShowRenderingStatistics              | Boolean | false   |
| debugShowMemoryUsage                      | Boolean | false   |
| debugShowUrl                     

### `@load`

- **描述** 在 3D Tile 加载后发送该事件
- **Payload** 组件对象this

### `@loaded`

- **描述** 在 3D Tile的 readyPromise加载完毕后发送该事件
- **Payload** `{ tileset }`
- - `tileset` 瓦片数据集本身

### `@unload`

- **描述** 在组件卸载完毕后发送该事件
- **Payload** 无任何载荷信息
