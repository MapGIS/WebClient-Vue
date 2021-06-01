# VectorLayer

## 属性

All common [layers props](/api/Layers/README.md#props)

### `source`

- **类型:** `Object | String`
- **非侦听属性**
- **描述:** A vector tile source.
- **查看:** `Vector source` in [Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/#sources-vector)

## 计算属性

### `getSourceFeatures(filter?)`

- **参数:**
  - `filter` `Array` A filter to limit query results.
- **描述** Returns an array of GeoJSON Feature objects from assosiated source filtered by `filter`.
- **查看** `.querySourceFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#querysourcefeatures)

### `getRenderedFeatures(geometry, filter)`

- **参数:**
  - `filter` `Array` A filter to limit query results.
  - `geometry` `Array | Object` The geometry of the query region.
- **描述** Returns an array of visible GeoJSON Feature objects from assosiated source filtered by `filter`.
- **查看** `.queryRenderedFeatures()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures)

## 方法

### `setFeatureState(featureId, state)`

- **参数:**
  - `featureId` `String | Number` Feature identifier.
  - `state` `Object` A set of key-value pairs. The values should be valid JSON types.
- **描述** Sets the state of a feature. The state object is merged in with the existing state of the feature.
- **查看** `.setFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#setfeaturestate)

### `getFeatureState(featureId)`

- **参数:**
  - `featureId` `String | Number` Feature identifier.
- **描述** Gets the state of a feature.
- **查看** `.getFeatureState()` [map method](https://docs.mapbox.com/mapbox-gl-js/api/#map#getfeaturestate)

## 事件

All common layer [events](/api/Layers/#events)
