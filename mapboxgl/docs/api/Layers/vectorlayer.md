# 矢量图层

> mapgis-vector-layer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** 矢量瓦片源。
- **参考:** `Vector source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-vector)

## Computed getters 计算属性

### `getSourceFeatures(filter?)`

- **参数:**
- `filter` `Array` 限制了查询结果的过滤条件，数组类型。
- **描述** 通过所关联的过滤条件返回一个包含 GeoJSON 要素对象的数组。
- **参考** `.querySourceFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#querysourcefeatures)

### `getRenderedFeatures(geometry, filter)`

- **参数:**
- `filter` `Array`限制了查询结果的过滤条件，数组类型。
- `geometry` `Array | Object` 查询区间的几何图形。
- **描述** 通过所关联的过滤条件返回一个可见的 GeoJSON 要素对象的数组。
- **参考** `.queryRenderedFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures)

## Methods 方法


### `setFeatureState(featureId, state)`

- **参数:**
  - `featureId` `String | Number` Feature id。
  - `state` `Object` 一组键值对。值应该是有效的 JSON 类型对象。
- **描述** 设置要素的状态。状态对象将与要素的现有状态合并。
- **参考** `.setFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#setfeaturestate)

### `getFeatureState(featureId)`

- **参数:**
  - `featureId` `String | Number` Feature id。
- **描述** 获取一个要素的状态。
- **参考** `.getFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#getfeaturestate)

## 事件

All common layer [events](/api/Layers/#events)
